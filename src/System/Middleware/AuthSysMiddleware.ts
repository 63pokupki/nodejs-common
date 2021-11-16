import { MainRequest } from '../MainRequest';
import { UserSys } from '../UserSys';
import type { Response, NextFunction } from 'express';
import { AccessSys } from '../AccessSys';

/* проверка аутентификации на уровне приложения */
export default async function AuthSysMiddleware(
	request: MainRequest,
	response: Response,
	next: NextFunction,
): Promise<void> {
	request.sys.bAuth = false;
	const userSys = new UserSys(request);

	// Инициализируем систему аутенфикации пользователя
	await userSys.init();

	request.sys.userSys = userSys;
	request.sys.accessSys = new AccessSys(request);

	next();
}
