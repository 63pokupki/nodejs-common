
// Глобальные сервисы
import { isObject, isArray } from 'util';
import Knex = require('knex')

// Системные сервисы
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { RedisSys } from './RedisSys';
import { MainRequest } from './MainRequest';

import { ModelValidatorSys } from '@a-a-game-studio/aa-components/lib';
import { UserSys } from './UserSys';
import { DbProvider } from './DbProvider';
import { CacheSys } from './CacheSys';
import { LogicSys } from './LogicSys';


/**
 * SQL Запросы
 */
export default class BaseSQL {

	/**
	 * Получаем базу данных для выполнения запроса
	 * В зависимости от bMasterDB
	 * может быть масте БД или балансировщик
	 */
	protected get db(): Knex{
		let db = null;
		if(this.req.sys.bMasterDB){
			db = this.dbMaster;
		} else {
			db = this.dbBalancer;
		}
		return db;
	};

	protected dbMaster: Knex;
	protected dbBalancer: Knex;


    /**
     * Отличие между dbProvider и db заключается в том,
     * что dbProvider умеет переключать поле current на транзакцию
     * и обратно после завешения транзакции
     *
     * Т.е. если в SQL классах использовать this.dbProvider.current вместо this.db
     * такой класс можно будет вызвать как внутри транзакции, так и отдельно
     */
    protected dbProvider: DbProvider;
    protected redisSys: RedisSys;

    protected modelValidatorSys: ModelValidatorSys;
    protected errorSys: ErrorSys;
	protected userSys: UserSys;
	protected req:MainRequest;
	protected cacheSys:CacheSys;
	protected logicSys: LogicSys;

    constructor(req: MainRequest) {
		this.req = req;

        this.modelValidatorSys = new ModelValidatorSys(req.sys.errorSys);
        this.errorSys = req.sys.errorSys;
		this.userSys = req.sys.userSys;
		this.logicSys = req.sys.logicSys;
        this.cacheSys = req.sys.cacheSys;

        this.dbProvider = req.infrastructure.dbProvider;
        if( req.infrastructure.mysql ){
            this.dbBalancer = req.infrastructure.mysql;
        } else {
            this.errorSys.error('db_no_connection', 'Отсутствует подключение к mysql');
		}

		// Если мастер есть ставим его
		if( req.infrastructure.mysqlMaster ){
            this.dbMaster = req.infrastructure.mysqlMaster;
        } else { // если мастера нет ставим MaxScale
			this.dbMaster = req.infrastructure.mysql
		}

		if(!this.dbMaster){ // Если мастера все еще нет ОШИБКА
			this.errorSys.error('db_master_no_connection', 'Отсутствует подключение к mysql мастеру');
		}


        if( req.infrastructure.redis ){
            this.redisSys = req.infrastructure.redis;
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
    async transaction<T>(func: () => Promise<T>) {
        const result = await this.dbProvider.transaction(func);
        return result
    }

    /**
     * Авто кеширование для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCache(sKey:string, iTimeSec:number, callback:any):Promise<any>{
		// todo временно проксируем для совместимости
        return await this.cacheSys.autoCache(sKey, iTimeSec, callback);
    }

    /**
     * Авто кеширование int переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCacheInt(sKey:string, iTimeSec:number, callback:any):Promise<number>{
		// todo временно проксируем для совместимости
        return await this.cacheSys.autoCacheInt(sKey, iTimeSec, callback);
    }

    /**
     * Авто кеширование ID переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCacheID(sKey:string, iTimeSec:number, callback:any):Promise<number>{
		// todo временно проксируем для совместимости
		return await this.cacheSys.autoCacheID(sKey, iTimeSec, callback);

    }

    /**
     * Очистить кеш редиса
     * @param sKey
     */
    async clearCache(sKey:string){
		// todo временно проксируем для совместимости
        return await this.cacheSys.clearCache(sKey);
    }

}
