import { MainRequest } from '../MainRequest';
import { UserSys } from '../UserSys';
import * as jwt from 'jsonwebtoken';
import type { Response, NextFunction } from 'express';

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
export default async function AuthSysMiddleware(
	request: MainRequest,
	response: Response,
	next: NextFunction,
): Promise<void> {
	const apikey = request.cookies.apikey || request.headers.apikey;

	if (apikey) {
		if (apikey.length > 32) {
			let decoded: JwtDecodeI = null;

			try {
				decoded = jwt.verify(apikey, request.conf.auth.secret, {
					algorithms: [
						request.conf.auth.algorithm,
					] as jwt.Algorithm[],
				}) as JwtDecodeI;
			} catch (e) {
				request.sys.errorSys.error(
					'token_expired_error',
					'Время жизни токена закончилось',
				);
			}

			// Проверяем что прошло меньше месяца
			if (decoded) {
				// Проверяем время жизни токена
				if (Date.now() / 1000 < decoded.exp) {
					// TODO это условие скорей всего не нужно поскольку выскакивает ошибка
					request.sys.apikey = decoded.token;
				} else {
					request.sys.apikey = '';
				}
			} else {
				request.sys.apikey = '';
			}
		} else {
			// Временное решение пока идет разработка
			// Дает возможность использовать старый токен
			request.sys.apikey = apikey;
		}
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
	//     /* проставляем авторизацию */
	//     request.sys.bAuth = true;

	// }
	request.sys.userSys = userSys;

	next();
}
