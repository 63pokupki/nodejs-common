"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserSys_1 = require("../UserSys");
const jwt = __importStar(require("jsonwebtoken"));
/* проверка аутентификации на уровне приложения */
async function AuthSysMiddleware(request, response, next) {
    if (request.headers.apikey && String(request.headers.apikey)) {
        if (request.headers.apikey.length > 32) {
            let decoded = null;
            try {
                decoded = jwt.verify(request.headers.apikey, request.conf.auth.secret, {
                    algorithms: [request.conf.auth.algorithm],
                });
            }
            catch (e) {
                request.sys.errorSys.error('token_expired_error', 'Время жизни токена закончилось');
            }
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