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
        let out;
        if (ok) { // Пробуем получить данные из кеша
            sCache = await this.redisSys.get(sKey);
            if (sCache) {
                bCache = true;
                this.errorSys.devNotice(sKey, 'Значение взято из кеша');
            }
        }
        if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
            this.redisSys.set(sKey, JSON.stringify(await callback()), iTimeSec);
        }
        if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
            out = JSON.parse(sCache);
        }
        return out;
    }
}
exports.default = BaseSQL;
//# sourceMappingURL=BaseSQL.js.map