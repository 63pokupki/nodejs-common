"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorSys_1 = require("./ErrorSys");
const UserSys_1 = require("./UserSys");
const Req = {
    headers: null,
    common: {
        env: 'dev',
        oldCoreURL: null,
    },
    sys: {
        apikey: '',
        bAuth: false,
        errorSys: null,
        userSys: null,
        responseSys: null
    },
    conf: null,
    infrastructure: {
        mysql: null,
        redis: null
    }
};
exports.devReq = Req;
function initMainRequest(conf) {
    let mainRequest;
    mainRequest = exports.devReq;
    mainRequest.conf = conf;
    mainRequest.sys.errorSys = new ErrorSys_1.ErrorSys(mainRequest);
    mainRequest.sys.userSys = new UserSys_1.UserSys(mainRequest);
    return mainRequest;
}
exports.initMainRequest = initMainRequest;
//# sourceMappingURL=MainRequest.js.map