"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorSys_1 = require("./ErrorSys");
const UserSys_1 = require("./UserSys");
const Req = {};
Req['S3'] = {
    endpoint: '',
    bucket: '',
    baseUrl: '',
    access: '',
    secret: ''
};
Req['headers'] = null;
Req['sys'] = {
    apikey: '',
    bAuth: false,
    errorSys: null,
    userSys: null,
    responseSys: null
};
Req['conf'] = null;
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