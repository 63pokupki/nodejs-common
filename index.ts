import { BaseCtrl } from './src/System/BaseCtrl'
import BaseSQL from './src/System/BaseSQL'
import BaseM from './src/System/BaseM'
import { ModelValidatorSys } from './src/System/ModelValidatorSys'

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
