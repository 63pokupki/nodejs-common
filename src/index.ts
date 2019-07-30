import { BaseCtrl } from './System/BaseCtrl'
import BaseSQL from './System/BaseSQL'
import BaseM from './System/BaseM'
import { ModelValidatorSys } from './System/ModelValidatorSys'

import { ModelOneRuleC } from './Components/ModelOneRuleC'
import { ModelRulesC } from './Components/ModelRulesC'

// /* LEGO ошибок */
import ErrorSysMiddleware from './System/Middleware/ErrorSysMiddleware'

/* Создает объект запроса */
import RequestSysMiddleware from './System/Middleware/RequestSysMiddleware'

/* Создает объект ответа */
import ResponseSysMiddleware from './System/Middleware/ResponseSysMiddleware'

// /* проверка авторизации на уровне приложения */
import AuthSysMiddleware from './System/Middleware/AuthSysMiddleware'


export default {
    BaseCtrl,
    BaseSQL,
    BaseM,
    ModelValidatorSys,
    ModelOneRuleC,
    ModelRulesC,
    Middleware: {
        ErrorSysMiddleware,
        RequestSysMiddleware,
        ResponseSysMiddleware,
        AuthSysMiddleware
    }
}
