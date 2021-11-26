
import { UserSys } from '../UserSys';
import * as jwt from 'jsonwebtoken';
import type { Response, NextFunction } from 'express';
import { AccessSys } from '../AccessSys';
import { P63Context } from '../P63Context';

/**
 * Ответ декодиирования тикена
 * Должен обновляться каждую неделю
 * Время действия токена 1 месяц
 * Если пользователь постоянно пользуется сайтом у него будет ощущение бесконечного токена
 * Токен скрыто обновляется если он старше 1 недели
 */
interface JwtDecodeI {
	token?: string; // старый статичный apikey
	iat?: number; // время создания токена
	exp?: number; // время действия токена
}

/* проверка аутентификации на уровне приложения */
export default async function AuthSysMiddleware(ctx:P63Context): Promise<void> {
	const apikey = ctx.cookies.apikey || ctx.headers.apikey;

	if (apikey) {
		if (apikey.length > 32) {
			let decoded: JwtDecodeI = null;

			try {
				decoded = jwt.verify(apikey, ctx.auth.secret, {
					algorithms: [
						ctx.auth.algorithm,
					] as jwt.Algorithm[],
				}) as JwtDecodeI;
			} catch (e) {
				ctx.sys.errorSys.error(
					'token_expired_error',
					'Время жизни токена закончилось',
				);
			}

			// Проверяем что прошло меньше месяца
			if (decoded) {
				// Проверяем время жизни токена
				if (Date.now() / 1000 < decoded.exp) {
					// TODO это условие скорей всего не нужно поскольку выскакивает ошибка
					ctx.sys.apikey = decoded.token;
				} else {
					ctx.sys.apikey = '';
				}
			} else {
				ctx.sys.apikey = '';
			}
		} else {
			// Временное решение пока идет разработка
			// Дает возможность использовать старый токен
			ctx.sys.apikey = apikey;
		}
	} else {
		ctx.sys.apikey = '';
	}

	/* юзерь не авторизован */
	ctx.sys.bAuth = false;
	const userSys = new UserSys(ctx);

	// Инициализируем систему для пользователей
	await userSys.init();

	// if (await userSys.isAuth()) {
	//     await userSys.init();
	//     /* проставляем авторизацию */
	//     request.sys.bAuth = true;

	// }
	ctx.sys.userSys = userSys;
	ctx.sys.accessSys = new AccessSys(ctx);

	ctx.next();
}
