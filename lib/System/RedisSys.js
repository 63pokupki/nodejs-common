"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSys = void 0;
const redis = __importStar(require("redis"));
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
        return new Promise((resolve) => {
            this.redisClient.get(key, (err, reply) => {
                if (err) {
                    resolve('');
                }
                resolve(reply);
            });
        });
    }
    /**
     * Получить ключи по шаблону
     * @param keys
     */
    keys(keys) {
        return new Promise((resolve, reject) => {
            this.redisClient.keys(keys, (err, reply) => {
                if (err) {
                    reject(err);
                }
                resolve(reply);
            });
        });
    }
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