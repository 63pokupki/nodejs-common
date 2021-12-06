
import { UserSys } from '../UserSys';
import { AccessSys } from '../AccessSys';
import { P63Context } from '../P63Context';

/* проверка аутентификации на уровне приложения */
export default async function AuthSysMiddleware(ctx:P63Context): Promise<void> {
	ctx.sys.bAuth = false;
	const userSys = new UserSys(ctx);

	// Инициализируем систему аутенфикации пользователя
	await userSys.init();

	ctx.sys.userSys = userSys;
	ctx.sys.accessSys = new AccessSys(ctx);

	ctx.next();
}
