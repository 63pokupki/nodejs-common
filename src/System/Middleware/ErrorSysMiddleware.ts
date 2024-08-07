import { ErrorSys } from '@63pokupki/components/lib';
import { P63Context } from '../P63Context';


/* LEGO ошибок */
export default function ErrorSysMiddleware(ctx: P63Context): void {
	ctx.sys = {
		apikey: '',
        srvkey: '',
		errorSys: null,
		userSys: null,
		responseSys: null,
		logicSys: null,
        monitoringSys: null,
		cacheSys: null,
		accessSys: null,
		bAuth: false,
        bSrv: false,
		bCache: true,
	};
	if (ctx) {
		ctx.sys.errorSys = new ErrorSys(ctx.common.env);
		if (ctx.common.errorMute) {
			// Здесь были настройки по игнорировнию ошибок
			// request.sys.errorSys;
		}
	} else {
		ctx.sys.errorSys = new ErrorSys();
	}

	ctx.next();
}
