export declare class RedisSys {
    redisClient: any;
    constructor(conf: any);
    get(key: string): Promise<string>;
    keys(keys: string): Promise<[]>;
    set(key: string, val: string | number, time?: number): void;
    del(keys: []): void;
}
