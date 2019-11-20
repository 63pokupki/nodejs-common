import BaseCtrl from './System/BaseCtrl'
// export { BaseCtrl as BaseCtrl };

import BaseSQL from './System/BaseSQL'
// export { BaseSQL as BaseSQL };

import BaseM from './System/BaseM'
// export { BaseM as BaseM };

import { ModelValidatorSys } from './System/ModelValidatorSys'
// export { ModelValidatorSys as ModelValidatorSys };

import { ErrorSys } from './System/ErrorSys';
// export { ErrorSys, BaseSQL };

import { UserSys, UserInfo } from './System/UserSys'
import { DbProvider } from './System/DbProvider'

import { ResponseSys } from './System/ResponseSys'

import { MainRequest, TError, initMainRequest } from './System/MainRequest'
import { devReq } from './System/MainRequest'

import { ModelOneRuleC } from './Components/ModelOneRuleC'

import { ModelRulesC, ModelRulesT } from './Components/ModelRulesC'

// /* LEGO ошибок */
import ErrorSysMiddleware from './System/Middleware/ErrorSysMiddleware'

/* Создает объект запроса */
import RequestSysMiddleware from './System/Middleware/RequestSysMiddleware'

/* Создает объект ответа */
import ResponseSysMiddleware from './System/Middleware/ResponseSysMiddleware'

// /* проверка авторизации на уровне приложения */
import AuthSysMiddleware from './System/Middleware/AuthSysMiddleware'

import { RedisSys } from './System/RedisSys';

/* Класс для работы с S3 */
import { S3objectParamsI, S3 } from './System/S3';

/* Отправлятор сообщений в Rabbit */
import { RabbitSenderSys } from './System/RabbitSenderSys';

/* Конструктор Консольной команды */
import BaseCommand from './System/BaseCommand';

/* Конструктор теста */
import BaseTest from './System/BaseTest';

import * as Seo from './Components/Seo';

/* Хелпер полезных функций */
import * as HelperSys from './System/HelperSys';
import { FieldValidator } from './System/FieldValidator';

import *  as Mattermost from './System/MattermostSys';
import { MainConfig, S3confI } from './System/MainConfig';
import * as S3DO from './System/S3DO';

import {
    ExpressRouterProxy,
    HandlerContext,
    Handler,
    HandlerDefinition,
    ControllerClass
} from './System/ExpressRouterProxy';

const Middleware = {
    ErrorSysMiddleware,
    RequestSysMiddleware,
    ResponseSysMiddleware,
    AuthSysMiddleware
};

export {
    BaseCtrl,
    BaseSQL,
    DbProvider,
    BaseM,
    ModelValidatorSys,
    ModelOneRuleC,
    ModelRulesC,
    ModelRulesT,
    ErrorSys,
    UserSys,
    UserInfo,
    ResponseSys,
    RedisSys,
    Middleware,
    MainRequest, // interface MainRequest,
    TError, 
    MainConfig,
    devReq, // Пример MainRequest
    S3,
    S3objectParamsI,
    S3confI,
    RabbitSenderSys,
    initMainRequest, // Инициализация Main Request для тестов
    BaseCommand, // Конструктор консольных команд
    BaseTest, // Конструктор тестов
    Seo, // сео собственно
    HelperSys, // Вспомогательные функции которые ни к чему не привязаны
    FieldValidator, // 
    Mattermost,
    S3DO,
    ExpressRouterProxy,
    HandlerContext,
    Handler,
    HandlerDefinition,
    ControllerClass
}
