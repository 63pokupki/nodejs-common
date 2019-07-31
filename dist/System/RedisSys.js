"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
class RedisSys {
    constructor(conf) {
        this.redisClient = redis.createClient(conf);
    }
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
    set(key, val, time = 3600) {
        this.redisClient.set(key, val, 'EX', time);
    }
    del(keys) {
        if (keys.length > 0) {
            this.redisClient.del(keys);
        }
    }
}
exports.RedisSys = RedisSys;
//# sourceMappingURL=RedisSys.js.map