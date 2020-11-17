import * as redis from 'redis';

/** Обертка над редисом которая понимает async/await */
export class RedisSys {
	public redisClient: redis.RedisClient;

	constructor(conf: any) {
		this.redisClient = redis.createClient(conf);
	}

	/**
     * Получить значение из редиса
     * @param key
     */
	public get(key: string): Promise<string> {
		return new Promise((resolve) => {
			this.redisClient.get(key, (err: any, reply: string) => {
				if (err) {
					resolve('');
				}
				resolve(reply);
			});
		});
	}

	/**
     * Получить ключи по шаблону - медленный способ
     * @param keys
     */
	public keys(keys: string): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.redisClient.keys(keys, (err: any, reply: any[]) => {
				if (err) {
					reject(err);
				}

				resolve(reply);
			});
		});
	}

	/**
     * Получить ключи по шаблону сканированием
     * @param keys
     */
	public scan(keys: string, count:number): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.redisClient.scan('0', 'MATCH', keys, 'COUNT', String(count+1000), (err: any, reply: any[]) => {
				if (err) {
					reject(err);
				}

				resolve(reply[1]);
			});
		});
	}

	/**
     * Получить количество ключей базы данных
     * @param keys
     */
	public dbsize(): Promise<number> {
		return new Promise((resolve, reject) => {
			this.redisClient.dbsize((err: any, reply: number) => {
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
	public set(key: string, val: string|number, time = 3600): void {
		this.redisClient.set(key, String(val), 'EX', time);
	}

	/**
     * Удалить ключи по ID
     * @param keys
     */
	public del(keys: any[]): void {
		if (keys.length > 0) {
			this.redisClient.unlink(keys);
		}
	}
}
