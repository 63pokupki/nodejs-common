/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ErrorSys } from '@a-a-game-studio/aa-components';
import { Knex } from 'knex';
import { AAContext } from '@a-a-game-studio/aa-server';

import axios, { AxiosInstance } from 'axios';
import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';
import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';
import { AccessSys } from './AccessSys';
import { SeoBase } from '../Components/Seo';
import { RedisSys } from './RedisSys';
import { RabbitSenderSys } from './RabbitSenderSys';
import { CryptAlgT } from '../Helpers/CryptoH';
import { JwtAlgT } from '../Helpers/JwtH';

export class P63Context extends AAContext {

	method: string;
    msg?:string; // Сообщение какой роутер выполняется

	common: {
		env: string;
		oldCoreURL: string;
		nameApp: string;
		errorMute: boolean;
		hook_url_errors: string;
		hook_url_monitoring: string;
		hook_url_front_errors: string;
        hook_url_errors_api: string;
        hook_url_auth: string;
		port: number;
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
		apikey: string;
        srvkey: string;
		bAuth: boolean;
        bSrv: boolean;
		bMasterDB: boolean;
		bCache?: boolean;
		errorSys: ErrorSys;
		userSys: UserSys;
		responseSys: ResponseSys;
		logicSys: LogicSys;
		cacheSys: CacheSys;
		accessSys: AccessSys;
		seo?: SeoBase;
	} = <any>{};

	infrastructure: {
		mysql: Knex;
		mysqlMaster: Knex;
        mysqlMasterPool?: Knex[]; // Пулл для мультимастера
        mysqlSlavePool?: Knex[]; // Пулл для балансировки запросов
		sphinx?: Knex;
		redis: RedisSys;
		rabbit: RabbitSenderSys;
		sphinxErrors?: Knex;
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
		hook_url_errors: 'https://', 		// Сообщения об ошибках mattermost
		hook_url_monitoring: 'https://', 	// Сообщения мониторинга в mattermost
		hook_url_front_errors: 'https://', 	// Сообщения мониторинга ошибок в mattermost
        hook_url_errors_api: 'https://',    // Система ошибок
        hook_url_auth: 'https://',          // Авторизация
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
		bMasterDB: false, 		// По умолчанию используется maxScale
		bCache: true, 			// По умолчанию кеш используется

		errorSys: null, 		// Система ошибок
		userSys: null, 			// Система пользователя
		responseSys: null, 		// Система формирвания ответа
		logicSys: null, 		// Система логики управления приложением
		cacheSys: null, 		// Система кеширования\
		accessSys: null,
	},
	infrastructure: {
		mysql: null, 			// коннект к балансеру БД
		mysqlMaster: null, 		// конект к мастеру
		sphinx: null,
		redis: null,
		rabbit: null,
		sphinxErrors: null,
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
