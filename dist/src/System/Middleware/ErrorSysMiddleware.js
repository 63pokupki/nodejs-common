"use strict";
const ErrorSys_1 = require('../ErrorSys');
function ErrorSysMiddleware(request, response, next) {
    request.sys = {
        apikey: '',
        errorSys: null,
        userSys: null,
        responseSys: null,
        bAuth: false
    };
    request.sys.errorSys = new ErrorSys_1.ErrorSys(request);
    next();
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ErrorSysMiddleware;
//# sourceMappingURL=ErrorSysMiddleware.js.map