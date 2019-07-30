
var redis = require("redis");

/**
 * Обертка над редисом которая понимает async/await
 */
export class RedisSys{

    public redisClient:any;

    constructor(conf:any){
        this.redisClient = redis.createClient(conf);
    }

    /**
     * Получить значение из редиса
     * @param key
     */
    public get(key: string):Promise<string> {
        return new Promise((resolve, reject) => {

            this.redisClient.get(key, function (err: any, reply: string) {
                if (err) {
                    resolve('');
                }
                resolve(reply);

            });
        })
    };

    /**
     * Получить ключи по шаблону
     * @param keys
     */
    public keys(keys: string): Promise<[]> {
        return new Promise((resolve, reject) => {

            this.redisClient.keys(keys, function (err: any, reply: []) {
                if (err) {
                    reject(err);
                }
                resolve(reply);

            });

        })
    };

    /**
     * Поместить значение в редис
     * @param key
     * @param val
     * @param time
     */
    public set(key: string, val: string|number, time: number = 3600){
        this.redisClient.set(key, val, 'EX', time);
    }

    /**
     * Удалить ключи по ID
     * @param keys
     */
    public del(keys: []){
        if( keys.length > 0 ){
            this.redisClient.del(keys);
        }
    }
}
