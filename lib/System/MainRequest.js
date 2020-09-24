"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TError = exports.initMainRequest = exports.devReq = void 0;
const lib_1 = require("@a-a-game-studio/aa-components/lib");
const Req = {
    headers: null,
    common: {
        env: 'dev',
        oldCoreURL: null,
        nameApp: 'default',
        errorMute: true,
        hook_url_errors: 'https://',
        hook_url_monitoring: 'https://',
        hook_url_front_errors: 'https://',
        port: 3005,
    },
    sys: {
        apikey: '',
        bAuth: false,
        bMasterDB: false,
        bCache: true,
        errorSys: null,
        userSys: null,
        responseSys: null,
        logicSys: null,
        cacheSys: null,
    },
    conf: null,
    infrastructure: {
        mysql: null,
        mysqlMaster: null,
        sphinx: null,
        redis: null,
        rabbit: null,
    },
};
exports.devReq = Req;
/**
 * Инициализация MainRequest для консольных запросов
 */
function initMainRequest(conf) {
    let mainRequest;
    mainRequest = exports.devReq;
    mainRequest.conf = conf;
    mainRequest.sys.errorSys = new lib_1.ErrorSys(conf.common.env);
    if (conf.common.errorMute) { // Настройка режим тищины
        mainRequest.sys.errorSys.option({
            bMute: true,
        });
    }
    return mainRequest;
}
exports.initMainRequest = initMainRequest;
/**
 * Типы ошибок
 */
var TError;
(function (TError) {
    TError[TError["None"] = 0] = "None";
    TError[TError["PageNotFound"] = 404] = "PageNotFound";
    TError[TError["Api"] = 1] = "Api";
    TError[TError["AllBad"] = 500] = "AllBad";
    TError[TError["AccessDenied"] = 403] = "AccessDenied";
})(TError = exports.TError || (exports.TError = {}));
//# sourceMappingURL=MainRequest.js.map