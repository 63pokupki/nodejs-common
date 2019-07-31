import BaseCtrl from './src/System/BaseCtrl'
import BaseSQL from './src/System/BaseSQL'
import BaseM from './src/System/BaseM'
import { ModelValidatorSys } from './src/System/ModelValidatorSys'

import { ErrorSys } from './src/System/ErrorSys';
import { UserSys } from './src/System/UserSys'
import { ResponseSys } from './src/System/ResponseSys'


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


export default {
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
    Middleware: {
        ErrorSysMiddleware,
        RequestSysMiddleware,
        ResponseSysMiddleware,
        AuthSysMiddleware
    }
}
