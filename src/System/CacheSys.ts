import { RedisSys } from './RedisSys';
import { MainRequest } from './MainRequest';

import { UserSys } from './UserSys';
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { isObject } from 'util';

/**
 * Система кеширования
 */
export class CacheSys {
	protected redisSys: RedisSys;

	protected errorSys: ErrorSys;

	protected userSys: UserSys;

	protected req: MainRequest;

	constructor(req: MainRequest) {
		this.req = req;
		this.errorSys = req.sys.errorSys;
		this.userSys = req.sys.userSys;

		if (req.infrastructure.redis) {
			this.redisSys = req.infrastructure.redis;
		} else {
			this.errorSys.error('db_redis', 'Отсутствует подключение к redis');
		}
	}

	/**
     * Авто кеширование для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
	async autoCache(sKey: string, iTimeSec: number, callback: any): Promise<any> {
		const ok = this.errorSys.isOk();

		let bCache = false; // Наличие кеша

		let sCache = null;
		let out: any = null;
		if (ok && this.req.sys.bCache) { // Пробуем получить данные из кеша
			sCache = await this.redisSys.get(sKey);

			if (sCache) {
				bCache = true;
				this.errorSys.devNotice(
					sKey, 'Значение взято из кеша',
				);
			}
		}

		if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
			out = await callback();

			if (out && (isObject(out) || Array.isArray(out))) {
				this.redisSys.set(
					sKey,
					JSON.stringify(out),
					iTimeSec,
				);
			} else {
				this.errorSys.devNotice(
					sKey, 'Не удалось посместить значение в кеш',
				);
			}
		}

		if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
			out = JSON.parse(sCache);
		}

		return out;
	}

	/**
     * Авто кеширование строки для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
	async autoCacheStr(sKey: string, iTimeSec: number, callback: any): Promise<string> {
		const ok = this.errorSys.isOk();

		let bCache = false; // Наличие кеша

		let sCache = null;
		let out: any = null;
		if (ok && this.req.sys.bCache) { // Пробуем получить данные из кеша
			sCache = await this.redisSys.get(sKey);

			if (sCache) {
				bCache = true;
				this.errorSys.devNotice(
					sKey, 'Значение взято из кеша',
				);
			}
		}

		if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
			out = await callback();

			if (out && !Number(out) && String(out)) {
				this.redisSys.set(
					sKey,
					String(out),
					iTimeSec,
				);
			} else {
				this.errorSys.devNotice(
					sKey, 'Не удалось посместить значение в кеш, значение не является строкой',
				);
			}
		}

		if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
			out = sCache;
		}

		return out;
	}

	/**
     * Авто кеширование int переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
	async autoCacheInt(sKey: string, iTimeSec: number, callback: any): Promise<number> {
		const ok = this.errorSys.isOk();

		let bCache = false; // Наличие кеша

		let sCache = null;
		let out: number = null;
		if (ok && this.req.sys.bCache) { // Пробуем получить данные из кеша
			sCache = await this.redisSys.get(sKey);

			if (sCache) {
				bCache = true;
				this.errorSys.devNotice(
					sKey, 'Значение взято из кеша',
				);
			}
		}

		if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
			out = Number(await callback());
			if (out || out === 0) {
				this.redisSys.set(
					sKey,
					String(out),
					iTimeSec,
				);
			} else {
				this.errorSys.devWarning(
					sKey, `Неверный тип, должен быть number => ${out}`,
				);
			}
		}

		if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
			out = Number(sCache);
		}

		return out;
	}

	/**
     * Авто кеширование ID переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
	async autoCacheID(sKey: string, iTimeSec: number, callback: any): Promise<number> {
		const ok = this.errorSys.isOk();

		let bCache = false; // Наличие кеша

		let sCache = null;
		let out: number = null;
		if (ok && this.req.sys.bCache) { // Пробуем получить данные из кеша
			sCache = await this.redisSys.get(sKey);

			if (sCache) {
				bCache = true;
				this.errorSys.devNotice(
					sKey, 'Значение взято из кеша',
				);
			}
		}

		if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
			out = Number(await callback());
			if (out || out > 0) {
				this.redisSys.set(
					sKey,
					String(out),
					iTimeSec,
				);
			} else {
				this.errorSys.devWarning(
					sKey, `Неверный тип, должен быть number => ${out}`,
				);
			}
		}

		if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
			out = Number(sCache);
		}

		return out;
	}

	/**
     * Очистить кеш редиса
     * @param sKey
     */
	async clearCache(sKey: string): Promise<void> {
		if(sKey.indexOf('*') >=0 ){ // Если передано регулярное выражение

			await this.redisSys.clear(sKey);
			// console.log('clearCache-pattern>>>', sKey);
		} else { // Если имеется точное совпадение
			const kRedisCache = await this.redisSys.redisScan.get(sKey);
			// console.log('clearCache-one>>>', sKey, kRedisCache);

			if(kRedisCache){
				await this.redisSys.del([kRedisCache]);
			}
		}
	}
}
