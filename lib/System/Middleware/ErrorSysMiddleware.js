"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorSys_1 = require("../ErrorSys");
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
        bMasterDB: false
    };
    request.sys.errorSys = new ErrorSys_1.ErrorSys(request);
    next();
}
exports.default = ErrorSysMiddleware;
//# sourceMappingURL=ErrorSysMiddleware.js.map