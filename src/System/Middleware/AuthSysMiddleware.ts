
import { UserSys } from '../UserSys';
import * as jwt from 'jsonwebtoken';
import { AccessSys } from '../AccessSys';
import { P63Context } from '../P63Context';

import { fAxiosConnect } from '../AxiosConnect';

const axiosConnect = fAxiosConnect();

/**
 * Ответ декодиирования тикена
 * Должен обновляться каждую неделю
 * Время действия токена 1 месяц
 * Если пользователь постоянно пользуется сайтом у него будет ощущение бесконечного токена
 * Токен скрыто обновляется если он старше 1 недели
 */
interface UserInfoI {
	apikey?: string; // старый статичный apikey

}

/* проверка аутентификации на уровне приложения */
export default async function AuthSysMiddleware(ctx:P63Context): Promise<void> {
	const apikey = ctx.cookies.apikey || String(ctx.headers.apikey);

    ctx.sys.apikey = apikey
    ctx.apikey = ctx.sys.apikey;

	/* юзерь не авторизован */
	ctx.sys.bAuth = false;
	const userSys = new UserSys(ctx);

	// Инициализируем систему для пользователей
    try { // отправка ошибки в апи
		const vUserResp = await axiosConnect.post(ctx.common.hook_url_auth, { apikey });
        await userSys.init({
            vUser:vUserResp.data.user_info,
            aGroup:vUserResp.data.list_group
        });
	} catch (e) {
		ctx.sys.errorSys.warning(
            'auth_check',
            'Ошибка проверки авторизации',
        );
	}
	

	// if (await userSys.isAuth()) {
	//     await userSys.init();
	//     /* проставляем авторизацию */
	//     request.sys.bAuth = true;

	// }
	ctx.sys.userSys = userSys;
	ctx.sys.accessSys = new AccessSys(ctx);

	ctx.next();
}
