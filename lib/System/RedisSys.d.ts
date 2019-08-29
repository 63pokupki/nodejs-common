/**
 * Обертка над редисом которая понимает async/await
 */
export declare class RedisSys {
    redisClient: any;
    constructor(conf: any);
    /**
     * Получить значение из редиса
     * @param key
     */
    get(key: string): Promise<string>;
    /**
     * Получить ключи по шаблону
     * @param keys
     */
    keys(keys: string): Promise<[]>;
    /**
     * Поместить значение в редис
     * @param key
     * @param val
     * @param time
     */
    set(key: string, val: string | number, time?: number): void;
    /**
     * Удалить ключи по ID
     * @param keys
     */
    del(keys: []): void;
}
