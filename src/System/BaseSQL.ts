import { ModelValidatorSys, ErrorSys } from '@a-a-game-studio/aa-components/lib';
import  knex, { Knex } from 'knex';

// Системные сервисы
import { RedisSys } from './RedisSys';

import { UserSys } from './UserSys';
import { CacheSys } from './CacheSys';
import { LogicSys } from './LogicSys';
import { P63Context } from './P63Context';
import { mRandomInteger } from '../Helpers/NumberH';
import { MonitoringSys } from '@63pokupki/monitoring.lib';

let iQCounter = 0;
let iQBSlave = 0;
let iQBMaster = 0;
let iQRSlave = 0;
let iQRMaster = 0;
let iQIncorrect = 0;

/**
 * SQL Запросы
 */
export default class BaseSQL {
   

    // =====================================
    // PARAM
    // =====================================


    /** Единичный ведомая база данных */
    protected db: Knex;

    /** Редис запросы - база данных для кеширования */
	protected redisSys: RedisSys;

    /** Система валидации данных */
	protected modelValidatorSys: ModelValidatorSys;

    /** Система ошибок */
	protected errorSys: ErrorSys;


	protected userSys: UserSys;

    /** API context */
	protected ctx: P63Context;

    /** система кеширования */
	protected cacheSys: CacheSys;

    /** система мониторинга */
	protected monitoringSys: MonitoringSys;

	protected logicSys: LogicSys;
    
    /** init */
	constructor(ctx: P63Context) {
		this.ctx = ctx;

		this.modelValidatorSys = new ModelValidatorSys(ctx.sys.errorSys);
		this.errorSys = ctx.sys.errorSys;
		this.userSys = ctx.sys.userSys;
		this.logicSys = ctx.sys.logicSys;
		this.cacheSys = ctx.sys.cacheSys;
        this.monitoringSys = ctx.sys.monitoringSys;

		if (ctx.infrastructure.mysql) {
			this.db = ctx.infrastructure.mysql;
		} else {
			this.errorSys.error('db_no_connection', 'Отсутствует подключение к mysql');
		}

		if (ctx.infrastructure.redis) {
			this.redisSys = ctx.infrastructure.redis;
		} else {
			this.errorSys.error('db_redis', 'Отсутствует подключение к redis');
		}
	}

    /**
     * TODO устаревший балансировщик запросов
	 * Выполняем запрос
	 */
	protected async dbExe<T = any>(vQueryBuilder:Knex.QueryBuilder | Knex.Raw): Promise<T> {
        let out:T = null;

        const builder = <any>vQueryBuilder;




        if (builder._method && builder.sql){
            iQIncorrect++;
        }
    
        if (!builder._method){ // Если метода нет значит raw запрос
            const sQueryStart = builder.sql.substr(0, 50).toLowerCase();
            const iSelectPos = sQueryStart.indexOf('select');
            const iInsertPos = sQueryStart.indexOf('insert');
            const iDeletePos = sQueryStart.indexOf('delete');
            const iUpdatePos = sQueryStart.indexOf('update');
            const bWrite = (iInsertPos >= 0 || iDeletePos >= 0 || iUpdatePos >= 0);
            if (iSelectPos >= 0 && !bWrite){
                iQRSlave++;
                builder.client = this.db.client;
            } else {
                iQRMaster++;
                builder.client = this.db.client;
            }
        } else if (builder._method === 'select' || builder._method === 'first' || builder._method === 'pluck'){
            
            iQBSlave++;
            builder.client = this.db.client;
        } else {
            iQBMaster++;
            builder.client = this.db.client;
    
            if ((builder._method !== 'insert' && builder._method !== 'update' && builder._method !== 'delete')){
                // console.log('builder._method>', builder._method, builder.sql);
                iQIncorrect++;
            }
    
        }

        // Выполнить запрос
        if (builder._method){ // _method только у билдера
            out = await builder
        } else {
            out = (await builder)[0]
        }



        iQCounter++;
        
        if (iQCounter % 100 == 0){
            console.log('>>>',
                ' iQCounter',
                iQCounter,
                ' iQBSlave>',
                iQBSlave,
                ' iQBMaster>',
                iQBMaster,
                ' iQRSlave>',
                iQRSlave,
                ' iQRMaster>',
                iQRMaster,
                'iQIncorrect>',
                iQIncorrect);
        }

        return out;
		
	}

    /**
     * TODO устаревший балансировщик запросов
	 * Получаем инстанс запроса Knex.Raw учитывая pool соединений
	 */
	protected async dbRaw<T = any>(sql:string, param?:Record<string, any>): Promise<T> {
        // const q = this.dbOne.raw(sql, param);
        let out:T = null;
		

        const sQueryStart = sql.substr(0, 50).toLowerCase();
        const iSelectPos = sQueryStart.indexOf('select');
        const iInsertPos = sQueryStart.indexOf('insert');
        const iDeletePos = sQueryStart.indexOf('delete');
        const iUpdatePos = sQueryStart.indexOf('update');
        const bWrite = (iInsertPos >= 0 || iDeletePos >= 0 || iUpdatePos >= 0);
        if(iSelectPos >= 0 && !bWrite){
            iQRSlave++;
            out = <any>(await this.db.raw(sql, param))
        } else {
            iQRMaster++;
            out = <any>(await this.db.raw(sql, param))
        }
            
        iQCounter++;
        
        if (iQCounter % 100 == 0){
            console.log('>>>',
                ' iQCounter',
                iQCounter,
                ' iQBSlave>',
                iQBSlave,
                ' iQBMaster>',
                iQBMaster,
                ' iQRSlave>',
                iQRSlave,
                ' iQRMaster>',
                iQRMaster,
                'iQIncorrect>',
                iQIncorrect);
        }
		return out;
	}

    protected async exe<T>(key:string, cb:() => Promise<T>){
        const vMsgMonitoring = {
            time_start: Date.now(),
            info:{
                user_id:String(this.ctx.sys?.userSys?.idUser),
            }
        };
        try {
            await cb();

            if(Date.now() - vMsgMonitoring.time_start > 5000){
                this.monitoringSys.sendInfoSqlTimelong('sqltimelong:'+this.ctx.common.nameApp+':'+this.ctx.req.url+':'+key, {
                    ...vMsgMonitoring,
                    data: {
                        body:this.ctx.body,
                        param:this.ctx.param,
                    },
                    time_end:Date.now(),
                });
            } else {
                this.monitoringSys.sendInfoSqlSuccsess('sql:'+this.ctx.common.nameApp+':'+this.ctx.req.url+':'+key, {
                    ...vMsgMonitoring,
                    time_end:Date.now(),
                });
            }
            
        } catch(e){
            this.errorSys.errorEx(e, key, 'SQLError>>>'+key);
            this.monitoringSys.sendErrorSql('sqlerror:'+this.ctx.common.nameApp+':'+this.ctx.req.url+':'+key, {
                ...vMsgMonitoring,
                data: {
                    trace:e,
                    body:this.ctx.body,
                    param:this.ctx.param,
                },
                time_end:Date.now(),
            });
        }
    }

    protected async throwExe<T>(key:string, cb:() => Promise<T>){
        const vMsgMonitoring = {
            time_start: Date.now(),
            info:{
                user_id:String(this.ctx.sys?.userSys?.idUser),
            }
        };
        try {
            await cb();

            if(this.monitoringSys && Date.now() - vMsgMonitoring.time_start > 5000){
                this.monitoringSys.sendInfoSqlTimelong('sqltimelong:'+this.ctx.common.nameApp+':'+this.ctx.req.url+':'+key, {
                    ...vMsgMonitoring,
                    data: {
                        body:this.ctx.body,
                        param:this.ctx.param,
                    },
                    time_end:Date.now(),
                });
            } else if(this.monitoringSys){
                this.monitoringSys.sendInfoSqlSuccsess('sql:'+this.ctx.common.nameApp+':'+this.ctx.req.url+':'+key, {
                    ...vMsgMonitoring,
                    time_end:Date.now(),
                });
            }
            
        } catch(e){

            if(this.monitoringSys){
                this.monitoringSys.sendErrorSql('sqlerror:'+this.ctx.common.nameApp+':'+this.ctx.req.url+':'+key, {
                    ...vMsgMonitoring,
                    data: {
                        trace:e,
                        body:this.ctx.body,
                        param:this.ctx.param,
                    },
                    time_end:Date.now(),
                });
            }

            throw this.errorSys.throwEx(e, key, 'SQLError>>>'+key);
        }
    }

	/**
     * Авто кеширование для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
	async autoCache(sKey: string, iTimeSec: number, callback: any): Promise<any> {
		// todo временно проксируем для совместимости
		return await this.cacheSys.autoCache(sKey, iTimeSec, callback);
	}

	/**
     * Авто кеширование int переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
	async autoCacheInt(sKey: string, iTimeSec: number, callback: any): Promise<number> {
		// todo временно проксируем для совместимости
		return await this.cacheSys.autoCacheInt(sKey, iTimeSec, callback);
	}

	/**
     * Авто кеширование ID переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
	async autoCacheID(sKey: string, iTimeSec: number, callback: any): Promise<number> {
		// todo временно проксируем для совместимости
		return await this.cacheSys.autoCacheID(sKey, iTimeSec, callback);
	}

	/**
     * Очистить кеш редиса
     * @param sKey
     */
	async clearCache(sKey: string): Promise<void> {
		// todo временно проксируем для совместимости
		return await this.cacheSys.clearCache(sKey);
	}
}
