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

import { UserSys } from './System/UserSys'

import { ResponseSys } from './System/ResponseSys'

import MainRequest from './System/MainRequest'
import { devReq } from './System/MainRequest'
import { initMainRequest } from './System/MainRequest'
// export { MainRequest as MainRequest };

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
import { S3objectParamsI, S3confI, S3 } from './System/S3';

/* Отправлятор сообщений в Rabbit */
import { RabbitSenderSys } from './System/RabbitSenderSys';

/* Конструктор Консольной команды */
import BaseCommand from './System/BaseCommand';

/* Конструктор теста */
import BaseTest from './System/BaseTest';

import * as Seo from './Components/Seo';

/* Хелпер полезных функций */
import * as HelperSys from './System/HelperSys';


const Middleware = {
    ErrorSysMiddleware,
    RequestSysMiddleware,
    ResponseSysMiddleware,
    AuthSysMiddleware
};

export {
    BaseCtrl,
    BaseSQL,
    BaseM,
    ModelValidatorSys,
    ModelOneRuleC,
    ModelRulesC,
    ModelRulesT,
    ErrorSys,
    UserSys,
    ResponseSys,
    RedisSys,
    Middleware,
    MainRequest, // interface MainRequest
    devReq, // Пример MainRequest
    S3,
    S3objectParamsI,
    S3confI,
    RabbitSenderSys,
    initMainRequest, // Инициализация Main Request для тестов
    BaseCommand, // Конструктор консольных комманд
    BaseTest, // Конструктор тестов
    Seo, // сео собственно
    HelperSys // Вспомогательные функцие которые никчему не привязаны
}
