import { P63Context } from "../P63Context";


export default function RequestSysMiddleware(ctx:P63Context): void {
	const errorSys = ctx.sys.errorSys;

	if (ctx.method === 'POST') {
		if (ctx.body.data) {
			try {
				ctx.body.data = JSON.parse(ctx.body.data);
			} catch (e) {
				errorSys.errorEx(e, 'data', 'Неправильный формат входных данных');
				ctx.body.data = null;
			}
		}
	}

	ctx.next();
}
