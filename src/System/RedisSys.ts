import * as redis from 'ioredis';

/** Обертка над редисом которая понимает async/await */
export class RedisSys {
	public redisMaster: redis.Redis;
	public redisSlave: redis.Redis;

	constructor(conf:string) {
		this.redisMaster = new redis.default(conf);
		this.redisSlave = new redis.default(conf);
	}

	/**
     * Получить значение из редиса
     * @param key
     */
	public async get(key: string): Promise<string> {
		return await this.redisSlave.get(key);
	}

	/**
     * Получить ключи по шаблону - медленный способ
     * @param keys
     */
	public async keys(keys: string): Promise<any[]> {
		return await this.redisSlave.keys(keys);
	}

	/**
     * Получить ключи по шаблону сканированием
     * @param keys
     */
	public async scan(keys: string, count:number): Promise<any[]> {
		return (await this.redisSlave.scan(0, 'MATCH', keys, 'COUNT', count))[1];
	}

	/**
     * Получить количество ключей базы данных
     * @param keys
     */
	public async dbsize(): Promise<number> {
		return await this.redisSlave.dbsize();
	}

	/**
     * Поместить значение в редис
     * @param key
     * @param val
     * @param time
     */
	public async set(key: string, val: string|number, time = 3600): Promise<any> {
		await this.redisMaster.set(key, String(val), 'EX', time);
	}

	/**
	 * Найти и удалить ключи по шаблону
	 * @param sMatch
	 * @param iCount
	 */
	public async clear(sMatch:string, iCount:number): Promise<any>{
		const stream = await this.redisSlave.scanStream({match:sMatch, count:iCount});
		stream.on("data", (aKeys) => {
			this.del(aKeys);
		});
	}

	/**
     * Удалить ключи по ID
     * @param keys
     */
	public async del(keys: any[]): Promise<any> {
		if (keys.length > 0) {
			await this.redisMaster.del(keys);
		}
	}
}
