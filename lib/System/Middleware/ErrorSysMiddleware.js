"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("@a-a-game-studio/aa-components/lib");
/* LEGO ошибок */
function ErrorSysMiddleware(request, response, next) {
    request.sys = {
        apikey: '',
        errorSys: null,
        userSys: null,
        responseSys: null,
        logicSys: null,
        cacheSys: null,
        bAuth: false,
        bMasterDB: false,
        bCache: true,
    };
    if (request.conf) {
        request.sys.errorSys = new lib_1.ErrorSys(request.conf.common.env);
        if (request.conf.common.errorMute) {
            request.sys.errorSys;
        }
    }
    else {
        request.sys.errorSys = new lib_1.ErrorSys();
    }
    next();
}
exports.default = ErrorSysMiddleware;
//# sourceMappingURL=ErrorSysMiddleware.js.map