"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorSys_1 = require("./ErrorSys");
const Req = {
    headers: null,
    common: {
        env: 'dev',
        oldCoreURL: null,
        errorMute: true,
        hook_url: 'https://',
        port: 3005,
    },
    sys: {
        apikey: '',
        bAuth: false,
        bMasterDB: false,
        errorSys: null,
        userSys: null,
        responseSys: null,
        logicSys: null,
    },
    conf: null,
    infrastructure: {
        mysql: null,
        redis: null
    }
};
exports.devReq = Req;
/**
 * Инициализация MainRequest для консольных запросов
 */
function initMainRequest(conf) {
    let mainRequest;
    mainRequest = exports.devReq;
    mainRequest.conf = conf;
    mainRequest.sys.errorSys = new ErrorSys_1.ErrorSys(mainRequest);
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