"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserSys_1 = require("../UserSys");
const jwt = require("jsonwebtoken");
/* проверка аутентификации на уровне приложения */
async function AuthSysMiddleware(request, response, next) {
    if (request.headers.apikey && String(request.headers.apikey)) {
        if (request.headers.apikey.length > 32) {
            let decoded = null;
            try {
                decoded = jwt.verify(request.headers.apikey, request.conf.auth.secret, {
                    algorithms: [request.conf.auth.algorithm]
                });
            }
            catch (e) {
                request.sys.errorSys.error('token_expired_error', 'Время жизни токена закончилось');
            }
            ;
            // Проверяем что прошло меньше месяца
            if (decoded) { // Проверяем время жизни токена
                if ((Date.now() / 1000) < decoded.exp) { // TODO это условие скорей всего не нужно поскольку выскакивает ошибка
                    request.sys.apikey = decoded.token;
                }
                else {
                    request.sys.apikey = '';
                }
            }
            else {
                request.sys.apikey = '';
            }
        }
        else { // Временное решение пока идет разработка
            // Дает возможность использовать старый токен
            request.sys.apikey = request.headers.apikey;
        }
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
    //     /* проставляем авторизацию */
    //     request.sys.bAuth = true;
    // }
    request.sys.userSys = userSys;
    next();
}
exports.default = AuthSysMiddleware;
//# sourceMappingURL=AuthSysMiddleware.js.map