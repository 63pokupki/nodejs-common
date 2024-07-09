/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ErrorSys } from '@63pokupki/components';
import { Knex } from 'knex';
import { AAContext } from '@63pokupki/server';

import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';
import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';
import { AccessSys } from './AccessSys';
import { RedisSys } from './RedisSys';
import { CryptAlgT } from '../Helpers/CryptoH';
import { JwtAlgT } from '../Helpers/JwtH';

import { MqClientSys } from '@63pokupki/mq';
import { MonitoringSys } from '@63pokupki/monitoring.lib';

export class P63Context extends AAContext {

	method: string;
    msg?:string; // Сообщение какой роутер выполняется

	common: {
		env: string;
		oldCoreURL: string;
		nameApp: string;
		errorMute: boolean;
        hook_url_auth: string;
        host_public:string;
		port: number;
	} = <any>{};
    auth: {
		algorithm: string;
		secret: string;
	} = <any>{};
    srv: { // маршрутизация сервера
        keyPool: string[], // ключи для корректной работы необходимы минимум 5 совпадений
        ipPool:string[],
        jwt:{ // jwt подпись
            jwtKey: string, // Ключ для шифровки jwt токена
            algorithm: JwtAlgT, // Алгоритм шифрования
            exp: number, // Время жизни
        },
        cry:{ // Ключ для шифровки данных
            key: string,
            algorithm: CryptAlgT
        }
    };
	sys: {
		apikey: string; // авторизационный ключ
        srvkey: string; // Межсерверный ключ
		bAuth: boolean; // Авторизация успешна/нет
        bSrv: boolean; // Межсерверный запрос авторизации
		bCache?: boolean;
		errorSys: ErrorSys;
		userSys: UserSys;
		responseSys: ResponseSys;
		logicSys: LogicSys;
		cacheSys: CacheSys;
		accessSys: AccessSys;
        monitoringSys: MonitoringSys;
	} = <any>{};

	infrastructure: {
		mysql: Knex;
		redis: RedisSys;
        mqError?: MqClientSys;
	} = <any>{};
}

const Req: any = {
	headers: {},
    cookies: {},
	common: { 								// Общее
		env: 'dev', 						// Тип окружения
		oldCoreURL: null, 					// URL адрес основного сайта
		nameApp: 'default',
		errorMute: true,
        hook_url_auth: 'https://',          // Авторизация
        host_public: 'https://',          // Публичный host
		port: 3005, 						// порт на котором будет работать нода
	},
    srv: { // маршрутизация сервера
        keyPool: [], // ключи для корректной работы необходимы минимум 5 совпадений
        ipPool:['127.0.0.1'],
        jwt:{ // jwt подпись
            jwtKey: '', // Ключ для шифровки jwt токена
            algorithm: '', // Алгоритм шифрования
            exp: 0, // Время жизни
        },
        cry:{ // Ключ для шифровки данных
            key: '',
            algorithm: '',
        }
    },
	sys: {
		apikey: '',
        srvkey: '',
		bAuth: false, 			// флаг авторизации
        bSrv: false, 			// флаг серверного запроса
		bCache: true, 			// По умолчанию кеш используется

		errorSys: null, 		// Система ошибок
		userSys: null, 			// Система пользователя
		responseSys: null, 		// Система формирвания ответа
		logicSys: null, 		// Система логики управления приложением
		cacheSys: null, 		// Система кеширования\
		accessSys: null,
        monitoringSys: null,    // Система мониторинга
	},
	infrastructure: {
		mysql: null, 			// коннект к БД по умолчанию
		redis: null,            // Система кеширования по умолчанию
        mqError: null           // Система очередей - ошибок
	},
};

export const devReq = Req;

/**
 * Инициализация MainRequest для консольных запросов
 * @param conf
 */
export function initMainRequest(conf: any): P63Context {
	let mainRequest: P63Context;

	mainRequest = devReq;

	mainRequest.sys.errorSys = new ErrorSys(conf.common.env);
	if (conf.common.errorMute) { // Настройка режим тищины
		mainRequest.sys.errorSys.option({
			bMute: true,
		});
	}

	return mainRequest;
}
