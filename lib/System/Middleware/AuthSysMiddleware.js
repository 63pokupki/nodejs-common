"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserSys_1 = require("../UserSys");
/* проверка аутентификации на уровне приложения */
async function AuthSysMiddleware(request, response, next) {
    if (request.headers.apikey) {
        request.sys.apikey = request.headers.apikey;
    }
    else {
        request.sys.apikey = '';
    }
    /* юзерь не авторизован */
    request.sys.bAuth = false;
    const userSys = new UserSys_1.UserSys(request);
    // Инициализируем систему для пользователей
    await userSys.init();
    // if (await userSys.isAuth()) {
    //     await userSys.init();
    //     /* проставляем аторизацию */
    //     request.sys.bAuth = true;
    // }
    request.sys.userSys = userSys;
    next();
}
exports.default = AuthSysMiddleware;
//# sourceMappingURL=AuthSysMiddleware.js.map