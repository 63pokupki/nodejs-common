
import { P63Context } from '../P63Context';
import { ResponseSys } from '../ResponseSys';

/* Переводит пост в JSON */
export default function ResponseSysMiddleware(ctx: P63Context): void {
	const responseSys = new ResponseSys(ctx);
	ctx.sys.responseSys = responseSys;

	ctx.next();
}
