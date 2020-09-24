import { ModelValidatorSys, ErrorSys } from '@a-a-game-studio/aa-components/lib';
import * as Knex from 'knex';
import { RedisSys } from './RedisSys';
import { MainRequest } from './MainRequest';
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
    protected get db(): Knex;
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
    protected req: MainRequest;
    protected cacheSys: CacheSys;
    protected logicSys: LogicSys;
    constructor(req: MainRequest);
    /**
     * Выполнить запросы в транзакции
     *
     * Для того чтобы вызываемые в func методы работали через транзакцию
     * нужно в SQL файлах вместо this.db использовать this.dbProvider.current
     */
    transaction<T>(func: () => Promise<T>): Promise<T>;
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
