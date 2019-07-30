"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserSys_1 = require("../UserSys");
async function AuthSysMiddleware(request, response, next) {
    if (request.headers.apikey) {
        request.sys.apikey = request.headers.apikey;
    }
    else {
        request.sys.apikey = '';
    }
    request.sys.bAuth = false;
    const userSys = new UserSys_1.UserSys(request);
    await userSys.init();
    request.sys.userSys = userSys;
    next();
}
exports.default = AuthSysMiddleware;
//# sourceMappingURL=AuthSysMiddleware.js.map