"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
/**
 * Обертка над редисом которая понимает async/await
 */
class RedisSys {
    constructor(conf) {
        this.redisClient = redis.createClient(conf);
    }
    /**
     * Получить значение из редиса
     * @param key
     */
    get(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, function (err, reply) {
                if (err) {
                    resolve('');
                }
                resolve(reply);
            });
        });
    }
    ;
    /**
     * Получить ключи по шаблону
     * @param keys
     */
    keys(keys) {
        return new Promise((resolve, reject) => {
            this.redisClient.keys(keys, function (err, reply) {
                if (err) {
                    reject(err);
                }
                resolve(reply);
            });
        });
    }
    ;
    /**
     * Поместить значение в редис
     * @param key
     * @param val
     * @param time
     */
    set(key, val, time = 3600) {
        this.redisClient.set(key, val, 'EX', time);
    }
    /**
     * Удалить ключи по ID
     * @param keys
     */
    del(keys) {
        if (keys.length > 0) {
            this.redisClient.del(keys);
        }
    }
}
exports.RedisSys = RedisSys;
//# sourceMappingURL=RedisSys.js.map