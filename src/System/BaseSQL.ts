import { ModelValidatorSys, ErrorSys } from '@a-a-game-studio/aa-components/lib';
import  knex, { Knex } from 'knex';

// Системные сервисы
import { RedisSys } from './RedisSys';

import { UserSys } from './UserSys';
import { CacheSys } from './CacheSys';
import { LogicSys } from './LogicSys';
import { P63Context } from './P63Context';
import { mRandomInteger } from '../Helpers/NumberH';

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
    // GET
    // =====================================

	/**
	 * Получаем базу данных для выполнения запроса
	 * В зависимости от bMasterDB
	 * может быть мастер БД или балансировщик
	 */
	protected get db(): Knex {
		let db = null;
		if (this.ctx.sys.bMasterDB) {
			db = this.dbMasterOne;
		} else {
			db = this.dbOne;
		};
		return db;
	}

    /**
	 * Получаем инстанс запроса Knex.QueryBuilder учитывая pool соединений
	 */
	protected async dbQuery<T = any>(vQueryBuilder:Knex.QueryBuilder): Promise<T> {
        const builder = <any>vQueryBuilder;
        let out:T = null;
        if (this.ctx.sys.bMasterDB) {
            iQBMaster++;
            vQueryBuilder.client = this.dbMasterOne.client;
			
        } else {
            if (builder._method === 'select' || builder._method === 'first' || builder._method === 'pluck'){
                iQBSlave++;
                vQueryBuilder.client = this.dbSlave.client;
            } else {
                iQBMaster++;
                vQueryBuilder.client = this.dbMaster.client;
        
                if (builder._method !== 'insert' && builder._method !== 'update' && builder._method !== 'delete'){
                    // console.log('builder._method>', builder._method, builder.sql);
                    iQIncorrect++;
                }
            }
            
        }

        // Выполнить запрос
        out = (await vQueryBuilder);

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
	 * Получаем инстанс запроса Knex.Raw учитывая pool соединений
	 */
	protected async dbQueryRaw<T = any>(sql:string, param?:Record<string, any>): Promise<T> {
        // const q = this.dbOne.raw(sql, param);
        let out:T = null;
		if (this.ctx.sys.bMasterDB) {
            iQRMaster++;
			out = <any>(await this.dbMasterOne.raw(sql, param));
        } else {

            const sQueryStart = sql.substr(0, 50).toLowerCase();
            const iSelectPos = sQueryStart.indexOf('select');
            const iInsertPos = sQueryStart.indexOf('insert');
            const iDeletePos = sQueryStart.indexOf('delete');
            const iUpdatePos = sQueryStart.indexOf('update');
            const bWrite = (iInsertPos >= 0 || iDeletePos >= 0 || iUpdatePos >= 0);
            if(iSelectPos >= 0 && !bWrite){
                iQRSlave++;
                out = <any>(await this.dbSlave.raw(sql, param))
            } else {
                iQRMaster++;
                out = <any>(await this.dbMaster.raw(sql, param))
            }
            
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
	 * Выполняем запрос
	 */
	protected async dbExe<T = any>(vQueryBuilder:Knex.QueryBuilder | Knex.Raw): Promise<T> {
        let out:T = null;

        const builder = <any>vQueryBuilder;

        try{

            if (this.ctx.sys.bMasterDB) {
                iQRMaster++;
                builder.client = this.dbMasterOne.client;
            } else {

                if (builder._method && builder.sql){
                    // console.log('builder._method>', builder._method, builder.sql);
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
                        builder.client = this.dbSlave.client;
                    } else {
                        iQRMaster++;
                        builder.client = this.dbMaster.client;
                    }
                } else if (builder._method === 'select' || builder._method === 'first' || builder._method === 'pluck'){
                    
                    iQBSlave++;
                    builder.client = this.dbSlave.client;
                } else {
                    iQBMaster++;
                    builder.client = this.dbMaster.client;
            
                    if ((builder._method !== 'insert' && builder._method !== 'update' && builder._method !== 'delete')){
                        // console.log('builder._method>', builder._method, builder.sql);
                        iQIncorrect++;
                    }
            
                }
            }

            // Выполнить запрос
            if (builder._method){ // _method только у билдера
                out = await builder
            } else {
                out = (await builder)[0]
            }

        } catch(e){
            throw this.errorSys.throwDB(e, 'dbExe - Не удалось выполнить запрос');
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

    // /**
	//  * Выполняем запрос
	//  */
	// protected async dbExe<T>(query:Knex.QueryBuilder | Knex.Raw): Promise<T> {
    //     let out:T = null;

    //     const builder = <any>query;
    //     let sQuery = query.toString();

    //     try{

    //         if (this.ctx.sys.bMasterDB) {
    //             iQRMaster++;
    //             out = <any>(await this.dbMasterOne.raw(sQuery));
    //         } else {

    //             if (builder._method && builder.sql){
    //                 // console.log('builder._method>', builder._method, builder.sql);
    //                 iQIncorrect++;
    //             }
            
    //             if (!builder._method){ // Если метода нет значит raw запрос
    //                 const sQueryStart = builder.sql.substr(0, 50).toLowerCase();
    //                 const iSelectPos = sQueryStart.indexOf('select');
    //                 const iInsertPos = sQueryStart.indexOf('insert');
    //                 const iDeletePos = sQueryStart.indexOf('delete');
    //                 const iUpdatePos = sQueryStart.indexOf('update');
    //                 const bWrite = (iInsertPos >= 0 || iDeletePos >= 0 || iUpdatePos >= 0);
    //                 if (iSelectPos >= 0 && !bWrite){
    //                     iQRSlave++;
    //                     out = (await this.dbSlave.raw(sQuery))[0]
    //                 } else {
    //                     iQRMaster++;
    //                     out = (await this.dbMaster.raw(sQuery))[0]
    //                 }
    //             } else if (builder._method === 'select' || builder._method === 'first' || builder._method === 'pluck'){
                    
    //                 iQBSlave++;
    //                 out = (await this.dbSlave.raw(sQuery))[0]
    //             } else {
    //                 iQBMaster++;
    //                 out = (await this.dbMaster.raw(sQuery))[0]
                    
            
    //                 if ((builder._method !== 'insert' && builder._method !== 'update' && builder._method !== 'delete')){
    //                     // console.log('builder._method>', builder._method, builder.sql);
    //                     iQIncorrect++;
    //                 }
            
    //             }
    //         }

    //     } catch(e){
    //         throw this.errorSys.throwDB(e, 'dbExe - Не удалось выполнить запрос');
    //     }

    //     iQCounter++;
        
    //     if (iQCounter % 100 == 0){
    //         console.log('>>>',
    //             ' iQCounter',
    //             iQCounter,
    //             ' iQBSlave>',
    //             iQBSlave,
    //             ' iQBMaster>',
    //             iQBMaster,
    //             ' iQRSlave>',
    //             iQRSlave,
    //             ' iQRMaster>',
    //             iQRMaster,
    //             'iQIncorrect>',
    //             iQIncorrect);
    //     }

    //     return out;
		
	// }

    /**
	 * Получаем базу данных для выполнения запроса - insert|update|delete
     * По умолчанию выибрается из пула мастер баз данных
	 * Если их нет отдает мастер БД
     * Если мастер соединений не найденно отдает балансировщик или одиночную БД
	 */
	protected get dbMaster(): Knex {
		let db = null;
		if (this.dbMasterPool?.length) {
            // Случайно отдаем одну базу данных из пула
            const iRand = mRandomInteger(0, this.dbMasterPool.length - 1)
            db = this.dbMasterPool[iRand]
		} else if(this.dbMasterOne) { // Если есть одиночный мастер отдаем его
			db = this.dbMasterOne;
		} else { // Если ничего не нашли отдаем одиночную базу данных
			db = this.dbOne;
		}
		return db;
	}

    /**
	 * Получаем базу данных для выполнения запроса - select
     * По умолчанию выибрается из пула ведомых баз данных
	 * Если их нет отдает ведомую БД
	 */
	protected get dbSlave(): Knex {
		let db = null;
        if (this.ctx.sys.bMasterDB) { // Если указан флаг брать с мастера берем с мастера
			db = this.dbMasterOne;
		} else if (this.dbSlavePool?.length) {
            // Случайно отдаем одну базу данных из пула
            const iRand = mRandomInteger(0, this.dbSlavePool.length - 1)
            db = this.dbSlavePool[iRand]
		} else { // Если пулл не нашли отдаем одиночную базу данных
			db = this.dbOne;
		}
		return db;
	}


    // =====================================
    // SET
    // =====================================

    /** Соединение для записи */
	protected set dbMaster(db:Knex) {
        this.dbMasterOne = db;
    }

    /** Балансировщик для запросов */
	protected set dbBalancer(db:Knex){
        this.dbOne = db;
    }

    // =====================================
    // PARAM
    // =====================================

    /** Единичная мастер база данных */
    protected dbMasterOne: Knex;

    /** Единичный ведомая база данных */
    protected dbOne: Knex;

    /** Пул мастер баз данных - конфигурации мультимастер */
    protected dbMasterPool: Knex[];

    /** Пул ведомых баз данных - конфигурации кластера */
    protected dbSlavePool: Knex[];
    
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

	protected logicSys: LogicSys;
    
    /** init */
	constructor(ctx: P63Context) {
		this.ctx = ctx;

		this.modelValidatorSys = new ModelValidatorSys(ctx.sys.errorSys);
		this.errorSys = ctx.sys.errorSys;
		this.userSys = ctx.sys.userSys;
		this.logicSys = ctx.sys.logicSys;
		this.cacheSys = ctx.sys.cacheSys;

		if (ctx.infrastructure.mysql) {
			this.dbBalancer = ctx.infrastructure.mysql;
		} else {
			this.errorSys.error('db_no_connection', 'Отсутствует подключение к mysql');
		}

		// Если мастер есть ставим его
		if (ctx.infrastructure.mysqlMaster) {
			this.dbMaster = ctx.infrastructure.mysqlMaster;
		} else { // если мастера нет ставим MaxScale
			this.dbMaster = ctx.infrastructure.mysql;
		}

        // Если мастер пулл есть ставим его
		if (ctx.infrastructure.mysqlMasterPool?.length) {
			this.dbMasterPool = ctx.infrastructure.mysqlMasterPool;
		}

        // Если ведомый пулл есть ставим его
		if (ctx.infrastructure.mysqlSlavePool?.length) {
			this.dbSlavePool = ctx.infrastructure.mysqlSlavePool;
		}

		if (!this.dbMasterOne) { // Если мастера все еще нет ОШИБКА
			this.errorSys.error('db_master_no_connection', 'Отсутствует подключение к mysql мастеру');
		}

		if (ctx.infrastructure.redis) {
			this.redisSys = ctx.infrastructure.redis;
		} else {
			this.errorSys.error('db_redis', 'Отсутствует подключение к redis');
		}
	}

	/**
     * Выполнить запросы в транзакции
     *
     * Для того чтобы вызываемые в func методы работали через транзакцию
     * нужно в SQL файлах вместо this.db использовать this.dbProvider.current
     */
	async transaction<T>(func: () => Promise<T>): Promise<T> {
		const result = await this.db.transaction(func);
		return result;
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
