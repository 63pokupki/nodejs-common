import BaseCtrl from './System/BaseCtrl';

import BaseSQL from './System/BaseSQL';

import BaseProxySQL from './System/BaseProxySQL';

import BaseM from './System/BaseM';
// export { BaseM as BaseM };

import { UserSys } from './System/UserSys';
import { faSendRouter, ResponseSys } from './System/ResponseSys';

import {
	P63Context, initMainRequest, devReq,
} from './System/P63Context';

// /* LEGO ошибок */
import ErrorSysMiddleware from './System/Middleware/ErrorSysMiddleware';

/* Создает объект запроса */
import RequestSysMiddleware from './System/Middleware/RequestSysMiddleware';

/* Создает объект ответа */
import ResponseSysMiddleware from './System/Middleware/ResponseSysMiddleware';


import { RedisSys } from './System/RedisSys';

/* Класс для работы с S3 */
import { S3objectParamsI, S3 } from './System/S3';

/* Конструктор Консольной команды */
import BaseCommand from './System/BaseCommand';

import * as Seo from './Components/Seo';

/* Хелпер полезных функций */
import * as HelperSys from './System/HelperSys';

import * as Mattermost from './System/MattermostSys';
import * as S3DO from './System/S3DO';
import { LogicSys } from './System/LogicSys';
import SubSysMiddleware from './System/Middleware/SubSysMiddleware';
import ParseBodyMiddleware from './System/Middleware/ParseBodyMiddleware';


import { CacheSys } from './System/CacheSys';
import { GroupT } from './Interfaces/GroupI';
import { OrgRoleT } from './Interfaces/OrgRoleI';
import { AvgCacheSys } from './System/AvgCacheSys';
import AuthSysMiddleware from './System/Middleware/AuthSysMiddleware';
import { mJwtDecode, mJwtEncode } from './Helpers/JwtH';
import { mDecrypt, mEncrypt } from './Helpers/CryptoH';
import { AccessBuilderSys } from './System/AccessBuilderSys';
import { MonitoringSys } from '@63pokupki/monitoring.lib';

const Middleware = {
    AuthSysMiddleware,
	ErrorSysMiddleware,
	RequestSysMiddleware,
	ResponseSysMiddleware,
	SubSysMiddleware,
    ParseBodyMiddleware,
};


export {
	BaseCtrl,
	BaseSQL,
    BaseProxySQL,
	BaseM,
	UserSys,
	AccessBuilderSys,
	LogicSys,
	CacheSys,
	ResponseSys,
	RedisSys,
    AvgCacheSys,
	Middleware,
	devReq, 			// Пример MainRequest
	S3,
	S3objectParamsI,
	initMainRequest, 	// Инициализация Main Request для тестов
    faSendRouter,
	BaseCommand, 		// Конструктор консольных команд
	Seo, 				// сео собственно
	HelperSys, 			// Вспомогательные функции которые ни к чему не привязаны
    P63Context,
	Mattermost,
    MonitoringSys,
	S3DO,
	GroupT,				// Группы пользователей
    OrgRoleT,           // Роли пользователей в организациях
    mJwtEncode, // Jwt кодировка - хелпер
    mJwtDecode, // Jwt раскодировка - хелпер
    mEncrypt, // кодировка данных - хелпер
    mDecrypt, // раскодировка данных - хелпер
};
