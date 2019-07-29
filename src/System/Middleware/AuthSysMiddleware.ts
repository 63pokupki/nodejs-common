import MainRequest from '../MainRequest';
import { UserSys } from '../UserSys';

/* проверка аутентификации на уровне приложения */
export default async function AuthSysMiddleware(request: MainRequest, response: any, next: any) {
    if (request.headers.apikey) {
        request.sys.apikey = request.headers.apikey;
    } else {
        request.sys.apikey = '';
    }

    /* юзерь не авторизован */
    request.sys.bAuth = false;
    const userSys = new UserSys(request);

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