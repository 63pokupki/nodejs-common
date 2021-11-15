import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { MainRequest } from '../MainRequest';

/* LEGO ошибок */
export default function ErrorSysMiddleware(request: MainRequest, response: any, next: any): void {
	request.sys = {
		apikey: '',
		errorSys: null,
		userSys: null,
		responseSys: null,
		logicSys: null,
		cacheSys: null,
		accessSys: null,
		bMasterDB: false,
		bCache: true,
	};
	if (request) {
		request.sys.errorSys = new ErrorSys(request.common.env);
		if (request.common.errorMute) {
			// Здесь были настройки по игнорировнию ошибок
			// request.sys.errorSys;
		}
	} else {
		request.sys.errorSys = new ErrorSys();
	}

	next();
}
