import BaseCtrl from './src/System/BaseCtrl'
// export { BaseCtrl as BaseCtrl };

import BaseSQL from './src/System/BaseSQL'
// export { BaseSQL as BaseSQL };

import BaseM from './src/System/BaseM'
// export { BaseM as BaseM };

import { ModelValidatorSys } from './src/System/ModelValidatorSys'
// export { ModelValidatorSys as ModelValidatorSys };

import { ErrorSys } from './src/System/ErrorSys';
// export { ErrorSys, BaseSQL };

import { UserSys } from './src/System/UserSys'

import { ResponseSys } from './src/System/ResponseSys'

import MainRequest from './src/System/MainRequest'
// export { MainRequest as MainRequest };

import { ModelOneRuleC } from './src/Components/ModelOneRuleC'
import { ModelRulesC } from './src/Components/ModelRulesC'

// /* LEGO ошибок */
import ErrorSysMiddleware from './src/System/Middleware/ErrorSysMiddleware'

/* Создает объект запроса */
import RequestSysMiddleware from './src/System/Middleware/RequestSysMiddleware'

/* Создает объект ответа */
import ResponseSysMiddleware from './src/System/Middleware/ResponseSysMiddleware'

// /* проверка авторизации на уровне приложения */
import AuthSysMiddleware from './src/System/Middleware/AuthSysMiddleware'
import { RedisSys } from './src/System/RedisSys';

const Middleware =  {
    ErrorSysMiddleware,
    RequestSysMiddleware,
    ResponseSysMiddleware,
    AuthSysMiddleware
}

export {
    BaseCtrl,
    BaseSQL,
    BaseM,
    ModelValidatorSys,
    ModelOneRuleC,
    ModelRulesC,
    ErrorSys,
    UserSys,
    ResponseSys,
    RedisSys,
    Middleware
}
