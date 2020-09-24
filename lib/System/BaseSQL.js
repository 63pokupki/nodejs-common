"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("@a-a-game-studio/aa-components/lib");
/**
 * SQL Запросы
 */
class BaseSQL {
    constructor(req) {
        this.req = req;
        this.modelValidatorSys = new lib_1.ModelValidatorSys(req.sys.errorSys);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        this.logicSys = req.sys.logicSys;
        this.cacheSys = req.sys.cacheSys;
        this.dbProvider = req.infrastructure.dbProvider;
        if (req.infrastructure.mysql) {
            this.dbBalancer = req.infrastructure.mysql;
        }
        else {
            this.errorSys.error('db_no_connection', 'Отсутствует подключение к mysql');
        }
        // Если мастер есть ставим его
        if (req.infrastructure.mysqlMaster) {
            this.dbMaster = req.infrastructure.mysqlMaster;
        }
        else { // если мастера нет ставим MaxScale
            this.dbMaster = req.infrastructure.mysql;
        }
        if (!this.dbMaster) { // Если мастера все еще нет ОШИБКА
            this.errorSys.error('db_master_no_connection', 'Отсутствует подключение к mysql мастеру');
        }
        if (req.infrastructure.redis) {
            this.redisSys = req.infrastructure.redis;
        }
        else {
            this.errorSys.error('db_redis', 'Отсутствует подключение к redis');
        }
    }
    /**
     * Получаем базу данных для выполнения запроса
     * В зависимости от bMasterDB
     * может быть масте БД или балансировщик
     */
    get db() {
        let db = null;
        if (this.req.sys.bMasterDB) {
            db = this.dbMaster;
        }
        else {
            db = this.dbBalancer;
        }
        return db;
    }
    /**
     * Выполнить запросы в транзакции
     *
     * Для того чтобы вызываемые в func методы работали через транзакцию
     * нужно в SQL файлах вместо this.db использовать this.dbProvider.current
     */
    async transaction(func) {
        const result = await this.dbProvider.transaction(func);
        return result;
    }
    /**
     * Авто кеширование для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCache(sKey, iTimeSec, callback) {
        // todo временно проксируем для совместимости
        return await this.cacheSys.autoCache(sKey, iTimeSec, callback);
    }
    /**
     * Авто кеширование int переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCacheInt(sKey, iTimeSec, callback) {
        // todo временно проксируем для совместимости
        return await this.cacheSys.autoCacheInt(sKey, iTimeSec, callback);
    }
    /**
     * Авто кеширование ID переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCacheID(sKey, iTimeSec, callback) {
        // todo временно проксируем для совместимости
        return await this.cacheSys.autoCacheID(sKey, iTimeSec, callback);
    }
    /**
     * Очистить кеш редиса
     * @param sKey
     */
    async clearCache(sKey) {
        // todo временно проксируем для совместимости
        return await this.cacheSys.clearCache(sKey);
    }
}
exports.default = BaseSQL;
//# sourceMappingURL=BaseSQL.js.map