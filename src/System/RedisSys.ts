import redis from 'ioredis';
import { knex, Knex } from 'knex';
import _ from 'lodash';
import { v4 as uuid4 } from 'uuid';
import ip from 'ip';

interface OneConnectI {
    urlDbMaster: string;
    urlDbScan: string;
}
interface OneDbConnectI {
    redisMaster: redis.Redis;
    redisScan: redis.Redis;
}
interface ConnectI{
    env?:string;
	urlDbMaster?: string;
	urlDbScan?: string;

	connect?: Record<string, OneConnectI[]>;

	// Если сканирование ключей настроено через sphinx
	sphinxDb?: Knex.Config;
	sphinxIndex?: string;
}

/** Обертка над редисом которая понимает async/await */
export class RedisSys {

    env:string = 'prod'

	public ixRedisDb: Record<number, OneDbConnectI> = {};
    public ixRedisDbError: Record<number, OneDbConnectI> = {};

    public ixRedisDbCommon: Record<number, OneDbConnectI> = {};
    public ixRedisDbCommonError: Record<number, OneDbConnectI> = {};

	public sphinxDb?: Knex;

	public sphinxIndex?: string;

	public ipSrv: string = ip.address();
    public ipConnectUse:string = ip.address();

	public asIpRedis: string[];

	public redisMaster: redis.Redis;

	public redisScan: redis.Redis;

    /** Проверка БД редиса */
    private async checkRedisDb(dbRedis:redis.Redis){
        let okConnect = true;
        try {
            const pong = await dbRedis.ping();
            okConnect = pong == 'PONG' ? true : false
        } catch(e){
            console.log('>>>ERROR ошибка проверки связи с редисом')
        }

        return okConnect;
    }

    /** Интервал проверки актуальности соединения REDIS */
    private intervalRedis = setInterval(async () => {
        
        let okMainConnect = await this.checkRedisDb(this.redisMaster);

        if(!okMainConnect){
            this.workErrorDb(this.redisMaster);
        }

        /** Убрать проблемную БД из пула по IP */
        for (const k in this.ixRedisDbError) {
            const dbRedis = this.ixRedisDbError[k];
            const okDbRedis = await this.checkRedisDb(dbRedis.redisMaster);

            if(okDbRedis){
                this.ixRedisDb[k] = this.ixRedisDbError[k];
                delete this.ixRedisDbError[k];
            }
        }

        /** Убрать проблемную БД из пула Общего */
        for (const k in this.ixRedisDbCommonError) {
            const dbRedis = this.ixRedisDbCommonError[k];
            const okDbRedis = await this.checkRedisDb(dbRedis.redisMaster);

            if(okDbRedis){
                this.ixRedisDbCommon[k] = this.ixRedisDbCommonError[k];
                delete this.ixRedisDbCommonError[k];
            }
        }

        if(this.env == 'dev'){
            console.log('>>>INTERVAL REDIS CONNECT', Date.now(), okMainConnect)
            console.log('>>>REDIS CONNECT>>>',
                'ip:', Object.keys(this.ixRedisDb).length, 'ipError:', Object.keys(this.ixRedisDbError).length,
                'common:', Object.keys(this.ixRedisDbCommon).length, 'commonError:', Object.keys(this.ixRedisDbCommonError).length);
        }

        
    },10000)

    /** Обработка БД с ошибками */
    workErrorDb(dbRedis:redis.Redis){
        
        const sCurrConnect = this.redisMaster.options.host+':'+dbRedis.options.port;
        const sWorkConnect = this.redisMaster.options.host+':'+dbRedis.options.port;

        // ============================================
        /** Убрать проблемную БД из пула по IP */
        for (const k in this.ixRedisDb) {
            const sIpConnect = dbRedis.options.host+':'+dbRedis.options.port;

            if(sWorkConnect == sIpConnect && this.ixRedisDb[k]){
                this.ixRedisDbError[k] = this.ixRedisDb[k];
                delete this.ixRedisDb[k];
            }
        }

        /** Убрать проблемную БД из пула Общего */
        for (const k in this.ixRedisDbCommon) {
            const sCommonConnect = dbRedis.options.host+':'+dbRedis.options.port;

            if(sWorkConnect == sCommonConnect && this.ixRedisDbCommon[k]){
                this.ixRedisDbCommonError[k] = this.ixRedisDbCommon[k];
                delete this.ixRedisDbCommon[k];
            }
        }

        /** Если ошибка произошла по текущему соединению */
        if(sCurrConnect == sWorkConnect){
            let bConnectFind = false;
            if(!bConnectFind){
                for (const k in this.ixRedisDb) {
                    this.redisMaster = this.ixRedisDb[k].redisMaster;
                    this.redisScan = this.ixRedisDb[k].redisScan;
                    bConnectFind = true;
                    break;
                }
            }
            if(!bConnectFind){
                for (const k in this.ixRedisDbCommon) {
                    this.redisMaster = this.ixRedisDbCommon[k].redisMaster;
                    this.redisScan = this.ixRedisDbCommon[k].redisScan;
                    bConnectFind = true;
                    break;
                }
            }

            if(!bConnectFind){
                console.log('>>>ERROR REDIS CONNECT>>> СОЕДИНЕНИЯ ОТСУТСТВУЮТ ');
            }
        }

        console.log('>>>REDIS CONNECT>>>',
            'ip:', Object.keys(this.ixRedisDb).length, 'ipError:', Object.keys(this.ixRedisDbError).length,
            'common:', Object.keys(this.ixRedisDbCommon).length, 'commonError:', Object.keys(this.ixRedisDbCommonError).length);
    }

    /** init */
	constructor(param: ConnectI) {

		this.ixRedisDb = {};

        if(param.env){
            this.env = param.env;
        }

		if (param.connect) {

            // Общий пул соединений для записи и резервного чтения
            const aConnectCommon = param.connect['*'];
            for (let i = 0; i < aConnectCommon.length; i++) {
                const vConnect = aConnectCommon[i];
                this.ixRedisDbCommon[i] = {
					redisMaster: new redis(vConnect.urlDbMaster),
					redisScan: new redis(vConnect.urlDbScan)
				}
            }

            // выделенный пул соединений для ip
            const aConnectIP = param.connect[this.ipSrv];
            if(aConnectIP){
                for (let i = 0; i < aConnectIP.length; i++) {
                    const vConnect = aConnectIP[i];
                    this.ixRedisDb[i] = {
                        redisMaster: new redis(vConnect.urlDbMaster),
                        redisScan: new redis(vConnect.urlDbScan)
                    }
                }
            } else {
                this.ixRedisDb = this.ixRedisDbCommon;
                this.ipConnectUse = '*'
            }

            if(this.ixRedisDb[0]){
                this.redisMaster = this.ixRedisDb[0].redisMaster,
			    this.redisScan = this.ixRedisDb[0].redisScan
            }
            
		} else if (param.urlDbMaster && param.urlDbScan) {
				this.redisMaster = new redis(param.urlDbMaster),
				this.redisScan = new redis(param.urlDbScan)

                this.ixRedisDb[0] = {
					redisMaster: this.redisMaster,
					redisScan: this.redisScan
				}

                // пул для записи
                this.ixRedisDbCommon[0] = {
					redisMaster: this.redisMaster,
					redisScan: this.redisScan
				}
		} else {
			console.log('Неверно указаны параметры для кеша:');
			console.log(`connect >> ${param.connect}`);
			console.log(`urlDbMaster >> ${param.urlDbMaster}`);
			console.log(`urlDbScan >> ${param.urlDbScan}`)
		}

		// Настройки sphinx
		if (param.sphinxDb && param.sphinxIndex) {
			this.sphinxDb = knex(param.sphinxDb);
			this.sphinxIndex = param.sphinxIndex;
		} else {
			console.log('Параметры sphinx для кеша не указаны!!!');
			console.log('sphinxDb>>>', param.sphinxDb);
			console.log('sphinxIndex>>>', param.sphinxIndex);
		}
	}

	/**
     * Получить значение из редиса
     * @param key
     */
	public async get(key: string): Promise<string> {

		// Пробуем получить ключ из кеша
		let kCaсheKey = await this.redisScan.get(key);

		// console.log('get-redis-scan',kCaсheKey);
		if (!kCaсheKey && this.sphinxDb) {
			kCaсheKey = await this.getFromSphinx(key);

			if (kCaсheKey) { // Если ключ в sphinx все таки есть записываем его в редис scan
				const aPromiseSet = [];
				
                for (const k in this.ixRedisDbCommon) {
                    const vRedisDb = this.ixRedisDbCommon[k];
					aPromiseSet.push((async () => {
                        try {
						    await vRedisDb.redisScan.set(key, kCaсheKey, 'EX', 30 * 24 * 3600)
                        } catch(e){
                            this.ixRedisDbCommonError[k] = this.ixRedisDbCommon[k];
                            delete this.ixRedisDbCommon[k];
                            console.log('>>>ERROR REDIS GET>>>', e)
                        }
                    })())
				}

				await Promise.all(aPromiseSet);
			}
		}

		let vData = null;
		if (kCaсheKey) { // Если ключ есть - можем запросить данные
			vData = await this.redisMaster.get(kCaсheKey);
		}

		return vData;
	}

	/**
     * Получить ключи по шаблону - медленный способ
     * @param sKeyPattern
     */
	public async keys(sKeyPattern: string): Promise<string[]> {

		let aKeys: string[] = [];
		if (this.sphinxDb) {
			aKeys = await this.scanFromSphinx(sKeyPattern);
		} else {
			aKeys = <any> await this.redisScan.keys(sKeyPattern);
		}
		return aKeys;
	}

	/**
     * Получить ключи по шаблону сканированием
     * @param keys
     */
	public async scan(sKeyPattern: string): Promise<string[]> {
		let aKeys: string[] = [];
		if (this.sphinxDb) {
			aKeys = await this.scanFromSphinx(sKeyPattern);
		} else {
			const iRedisSize = await this.redisScan.dbsize();
			aKeys = <any>(await this.redisScan.scan(0, 'MATCH', sKeyPattern, 'COUNT', iRedisSize))[1];
		}
		return aKeys;
	}

	/**
     * Получить количество ключей базы данных
     * @param keys
     */
	public async dbsize(): Promise<number> {
		return await this.redisScan.dbsize();
	}

	/**
     * Поместить значение в редис
     * @param key
     * @param val
     * @param time
     */
	public async set(key: string, val: string|number, time = 3600): Promise<string> {

		let kCaсheKey = await this.redisScan.get(key);

        

		// Записываем ключ если его нет при настройках sphinx
		if (!kCaсheKey && this.sphinxDb) {
			kCaсheKey = await this.setInSphinx(key);

            

			if (kCaсheKey) { // Записываем только если смогли сделать ключ
				const aPromiseSet = [];

                
                for (const k in this.ixRedisDbCommon) {
                    const vRedisDb = this.ixRedisDbCommon[k];

                    // console.log('vRedisDb',  vRedisDb)
					aPromiseSet.push((async () => {
                        try {
                            await vRedisDb.redisScan.set(key, kCaсheKey, 'EX', 30 * 24 * 3600)
                        } catch(e){
                            this.ixRedisDbCommonError[k] = this.ixRedisDbCommon[k];
                            delete this.ixRedisDbCommon[k];
                            console.log('>>>ERROR REDIS SET>>>', e)
                        }
                    })())
                }

				await Promise.all(aPromiseSet);
			}
		}

		// Записываем ключ если настроек сфинкс нет
		if (!kCaсheKey && !this.sphinxDb) {
			kCaсheKey = uuid4();
			// Кешируем на 1 день
			const aPromiseSet = [];

            for (const k in this.ixRedisDbCommon) {
                const vRedisDb = this.ixRedisDbCommon[k];
                aPromiseSet.push((async () => {
                    try {
                        await vRedisDb.redisScan.set(key, kCaсheKey, 'EX', 30 * 24 * 3600)
                    } catch(e){
                        this.ixRedisDbCommonError[k] = this.ixRedisDbCommon[k];
                        delete this.ixRedisDbCommon[k];
                        console.log('>>>ERROR REDIS SET>>>', e)
                    }
                })())
            }

			await Promise.all(aPromiseSet);
		}

		if (kCaсheKey) {
			const aPromiseSet = [];

            for (const k in this.ixRedisDbCommon) {
                const vRedisDb = this.ixRedisDbCommon[k];
                aPromiseSet.push((async () => {
                    try {
                        
                        await vRedisDb.redisMaster.set(kCaсheKey, String(val), 'EX', time);
                       
                    } catch(e){
                        this.ixRedisDbCommonError[k] = this.ixRedisDbCommon[k];
                        delete this.ixRedisDbCommon[k];
                        console.log('>>>ERROR REDIS SET>>>', e)
                    }
                })())
            }
			
			await Promise.all(aPromiseSet);
		}

		return kCaсheKey;
	}

	/**
	 * Найти и удалить ключи по шаблону
	 * @param sMatch
	 * @param iCount
	 */
	public async clear(sMatch: string): Promise<string[]> {
		const aKeys = await this.keys(sMatch);
		// console.log('=========================');
		// console.log('aKeys for match', sMatch);
		// console.log('aKeys for del', aKeys);
		// console.log('=========================');
		await this.del(aKeys);
		return aKeys;
	}

	/**
     * Удалить ключи по ID
     * @param keys
     */
	public async del(keys: any[]): Promise<any> {
		if (keys.length > 0) {
			const aPromiseDel = [];
			const aaKeys = _.chunk(keys, 1000);
			for (let i = 0; i < aaKeys.length; i++) {
				const aKeys = aaKeys[i];

                for (const k in this.ixRedisDbCommon) {
                    const vRedisDb = this.ixRedisDbCommon[k];
                    aPromiseDel.push((async () => {
                        try {
                            await vRedisDb.redisMaster.del(aKeys);
                        } catch(e){
                            this.ixRedisDbCommonError[k] = this.ixRedisDbCommon[k];
                            delete this.ixRedisDbCommon[k];
                            console.log('>>>ERROR REDIS DEL>>>', e)
                        }
                    })())
                }
			}

			await Promise.all(aPromiseDel);
		}
	}

	// ============================================
	// SPHINX операции с ключами
	// ============================================

	/**
     * Получить значение из редиса
     * @param sKey
     */
	private async getFromSphinx(sKey: string): Promise<string> {
		sKey = this.clearKeyForMatch(sKey);

		sKey = String(sKey);
		const sql = `

            SELECT id FROM ${this.sphinxIndex}
			WHERE
				k = :key
			AND
				end_at > :end_at
            LIMIT 1
            ;
        `;
		const param = {
			key: sKey,
			end_at: (new Date().getTime() / 1000),
		};
		// console.log('>>>getFromSphinx>>>', this.sphinxDb.raw(sql, param).toString());
		let v: any = null;
		try {
			v = (await this.sphinxDb.raw(sql, param))[0][0];
		} catch (e) {
			console.log('>>>ERROR MYSQL.REDISKEY>>>', e);
		}
		if (v) {
			v = v.id;
		}
		// console.log( v);
		return v;
	}

	/**
     * Получить ключи по шаблону сканированием
     * @param keys
     */
	public async scanFromSphinx(sKey: string): Promise<string[]> {
		sKey = this.clearKeyForMatch(sKey);

		sKey = sKey.replace(/[*]/g, '%');

		// let aKeyNew:string[] = [];
		// for (let i = 0; i < aKey.length; i++) {
		// 	const vKey = aKey[i];

		// 	if(vKey){
		// 		aKeyNew.push('"*'+String(vKey)+'*"');
		// 	}
		// }
		// aKey = aKeyNew;

		// sKey = aKey.join('<<');

		const sql = `

            SELECT id FROM ${this.sphinxIndex}
			WHERE
				k LIKE :key
			AND
				end_at > :end_at
			LIMIT 50000
            ;
		`;

		const param = {
			key: sKey,
			end_at: (new Date().getTime() / 1000),
		};
		// console.log('>>>scanFromSphinx>>>', this.sphinxDb.raw(sql, param).toString());
		let a: any[] = null;
		try {
			a = (await this.sphinxDb.raw(sql, param))[0];
		} catch (e) {
			console.log('>>>ERROR MYSQL.REDISKEY>>>', e);
		}

		if (a) {
			a = a.map((v) => String(v.id));
		}
		return a;
	}

	/**
     * Поместить значение в редис
     * @param sKey
     * @param val
     * @param time
     */
	public async setInSphinx(sKey: string): Promise<string> {
		let out = ''; // Ответ

		const vData = {
			k: sKey,
			created_at: (new Date().getTime() / 1000),
			end_at: (new Date().getTime() / 1000) + (30 * 24 * 3600),
		};

		try {
			const idKey = (await this.sphinxDb(this.sphinxIndex)
				.insert(vData)
			)[0];

			if (idKey) {
				out = String(idKey);
			}
		} catch (e) {
			out = ''; // Если произошла ошибка возвращаем пустую строку
			console.log('>>>ERROR MYSQL.REDISKEY>>>', e);
		}

		return out;
	}

	// Очистка ключа для поиска
	public clearKeyForMatch(sKey: string): string {
		sKey = sKey.replace(/["]/g, '');

		return sKey;
	}

	/** Ждет выполнения запросов и закрывает соединение */
	public quit() {

        for (const k in this.ixRedisDbCommon) {
            const vRedisDb = this.ixRedisDbCommon[k];
            vRedisDb.redisMaster.quit();
            vRedisDb.redisScan.quit();
        }
        if(this.ipConnectUse != '*'){
            for (const k in this.ixRedisDb) {
                const vRedisDb = this.ixRedisDb[k];
                vRedisDb.redisMaster.quit();
                vRedisDb.redisScan.quit();
            }
        }

        this.redisMaster.quit()
        this.redisScan.quit();
	}
}
