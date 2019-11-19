import Knex = require('knex');
import { ErrorSys } from './ErrorSys';
import { RedisSys } from './RedisSys';
import { MainRequest } from './MainRequest';
import { ModelValidatorSys } from './ModelValidatorSys';
import { UserSys } from './UserSys';
import { DbProvider } from './DbProvider';
/**
 * SQL Запросы
 */
export default class BaseSQL {
    protected db: Knex;
    protected dbProvider: DbProvider;
    protected redisSys: RedisSys;
    protected modelValidatorSys: ModelValidatorSys;
    protected errorSys: ErrorSys;
    protected userSys: UserSys;
    constructor(req: MainRequest);
    /**
     * Выполнить запросы в транзакции
     *
     * Для того чтобы вызываемые в func методы работали через транзакцию
     * нужно в SQL файлах вместо this.db использовать this.dbProvider.current
     */
    transaction: (func: () => Promise<void>) => Promise<void>;
    /**
     * Авто кеширование для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    autoCache(sKey: string, iTimeSec: number, callback: any): Promise<any>;
    /**
     * Авто кеширование int переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    autoCacheInt(sKey: string, iTimeSec: number, callback: any): Promise<number>;
    /**
     * Авто кеширование ID переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    autoCacheID(sKey: string, iTimeSec: number, callback: any): Promise<number>;
    /**
     * Очистить кеш редиса
     * @param sKey
     */
    clearCache(sKey: string): Promise<void>;
}
