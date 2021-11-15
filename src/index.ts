import BaseCtrl from './System/BaseCtrl';
// export { BaseCtrl as BaseCtrl };

import BaseSQL from './System/BaseSQL';
// export { BaseSQL as BaseSQL };

import BaseM from './System/BaseM';
// export { BaseM as BaseM };

import { UserSys } from './System/UserSys';
import { DbProvider } from './System/DbProvider';

import { ResponseSys } from './System/ResponseSys';

import {
	MainRequest, TError, initMainRequest, devReq,
} from './System/MainRequest';

// /* LEGO ошибок */
import ErrorSysMiddleware from './System/Middleware/ErrorSysMiddleware';

/* Создает объект запроса */
import RequestSysMiddleware from './System/Middleware/RequestSysMiddleware';

/* Создает объект ответа */
import ResponseSysMiddleware from './System/Middleware/ResponseSysMiddleware';

// /* проверка авторизации на уровне приложения */
import AuthSysMiddleware from './System/Middleware/AuthSysMiddleware';

import { RedisSys } from './System/RedisSys';

/* Класс для работы с S3 */
import { S3objectParamsI, S3 } from './System/S3';

/* Отправлятор сообщений в Rabbit */
import { rabbitSenderSys, RabbitSenderSys } from './System/RabbitSenderSys';

/* Конструктор Консольной команды */
import BaseCommand from './System/BaseCommand';

import * as Seo from './Components/Seo';

/* Хелпер полезных функций */
import * as HelperSys from './System/HelperSys';
import { FieldValidator } from './System/FieldValidator';

import * as Mattermost from './System/MattermostSys';
import * as S3DO from './System/S3DO';
import { LogicSys } from './System/LogicSys';
import SubSysMiddleware from './System/Middleware/SubSysMiddleware';

import {
	ExpressRouterProxy,
	HandlerContext,
	Handler,
	HandlerDefinition,
	ControllerClass,
} from './System/ExpressRouterProxy';
import { CacheSys } from './System/CacheSys';
import { RolesT } from './System/RolesI';
import { UserInfoI } from './Interface/AuthUser';

const Middleware = {
	ErrorSysMiddleware,
	RequestSysMiddleware,
	ResponseSysMiddleware,
	AuthSysMiddleware,
	SubSysMiddleware,
};

export {
	BaseCtrl,
	BaseSQL,
	DbProvider,
	BaseM,
	UserSys,
	UserInfoI as UserInfo,
	LogicSys,
	CacheSys,
	ResponseSys,
	RedisSys,
	Middleware,
	MainRequest, 		// interface MainRequest,
	TError,
	devReq, 			// Пример MainRequest
	S3,
	S3objectParamsI,
	RabbitSenderSys, 	// Класс системы для работы с ребитом
	rabbitSenderSys, 	// Объект система работы с ребитом
	initMainRequest, 	// Инициализация Main Request для тестов
	BaseCommand, 		// Конструктор консольных команд
	Seo, 				// сео собственно
	HelperSys, 			// Вспомогательные функции которые ни к чему не привязаны
	FieldValidator,
	Mattermost,
	S3DO,
	ExpressRouterProxy,
	HandlerContext,
	Handler,
	HandlerDefinition,
	ControllerClass,
	RolesT,				// Роли пользователей
};
