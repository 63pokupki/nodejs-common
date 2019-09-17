"use strict";
// Глобальные сервисы
Object.defineProperty(exports, "__esModule", { value: true });
const ModelValidatorSys_1 = require("./ModelValidatorSys");
/**
 * SQL Запросы
 */
class BaseSQL {
    constructor(req) {
        this.modelValidatorSys = new ModelValidatorSys_1.ModelValidatorSys(req);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        if (req.infrastructure.mysql) {
            this.db = req.infrastructure.mysql;
        }
        else {
            this.errorSys.error('db_no_connection', 'Отсутствует подключение к mysql');
        }
        if (req.infrastructure.redis) {
            this.redisSys = req.infrastructure.redis;
        }
        else {
            this.errorSys.error('db_redis', 'Отсутствует подключение к redis');
        }
    }
    /**
     * Авто кеширование для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCache(sKey, iTimeSec, callback) {
        let ok = this.errorSys.isOk();
        let bCache = false; // Наличие кеша
        let sCache = null;
        let out = null;
        if (ok) { // Пробуем получить данные из кеша
            sCache = await this.redisSys.get(sKey);
            if (sCache) {
                bCache = true;
                this.errorSys.devNotice(sKey, 'Значение взято из кеша');
            }
        }
        if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
            out = await callback();
            this.redisSys.set(sKey, JSON.stringify(out), iTimeSec);
        }
        if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
            out = JSON.parse(sCache);
        }
        return out;
    }
    /**
     * Авто кеширование int переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCacheInt(sKey, iTimeSec, callback) {
        let ok = this.errorSys.isOk();
        let bCache = false; // Наличие кеша
        let sCache = null;
        let out = null;
        if (ok) { // Пробуем получить данные из кеша
            sCache = await this.redisSys.get(sKey);
            if (sCache) {
                bCache = true;
                this.errorSys.devNotice(sKey, 'Значение взято из кеша');
            }
        }
        if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
            out = await callback();
            if (out || out === 0) {
                this.redisSys.set(sKey, String(out), iTimeSec);
            }
            else {
                this.errorSys.devWarning(sKey, 'Неверный тип, должен быть number => ' + out);
            }
        }
        if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
            out = Number(sCache);
        }
        return out;
    }
    /**
     * Очистить кеш редиса
     * @param sKey
     */
    async clearCache(sKey) {
        let aKeyList = await this.redisSys.keys(sKey);
        this.redisSys.del(aKeyList);
    }
}
exports.default = BaseSQL;
//# sourceMappingURL=BaseSQL.js.map