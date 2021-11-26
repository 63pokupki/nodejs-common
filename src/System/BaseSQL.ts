import { ModelValidatorSys, ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { Knex } from 'knex';

// Системные сервисы
import { RedisSys } from './RedisSys';

import { UserSys } from './UserSys';
import { CacheSys } from './CacheSys';
import { LogicSys } from './LogicSys';
import { P63Context } from './P63Context';

/**
 * SQL Запросы
 */
export default class BaseSQL {
	/**
	 * Получаем базу данных для выполнения запроса
	 * В зависимости от bMasterDB
	 * может быть масте БД или балансировщик
	 */
	protected get db(): Knex {
		let db = null;
		if (this.ctx.sys.bMasterDB) {
			db = this.dbMaster;
		} else {
			db = this.dbBalancer;
		}
		return db;
	}

	protected dbMaster: Knex;

	protected dbBalancer: Knex;

	protected redisSys: RedisSys;

	protected modelValidatorSys: ModelValidatorSys;

	protected errorSys: ErrorSys;

	protected userSys: UserSys;

	protected ctx: P63Context;

	protected cacheSys: CacheSys;

	protected logicSys: LogicSys;

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

		if (!this.dbMaster) { // Если мастера все еще нет ОШИБКА
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
