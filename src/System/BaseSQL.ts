import { ModelValidatorSys, ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { Knex } from 'knex';

// Системные сервисы
import { RedisSys } from './RedisSys';

import { UserSys } from './UserSys';
import { CacheSys } from './CacheSys';
import { LogicSys } from './LogicSys';
import { P63Context } from './P63Context';
import { mRandomInteger } from '../Helpers/NumberH';

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
		}
		return db;
	}

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
		if (this.dbSlavePool?.length) {
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
