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
		bAuth: false,
		bMasterDB: false,
		bCache: true,
	};
	if (request.conf) {
		request.sys.errorSys = new ErrorSys(request.conf.common.env);
		if (request.conf.common.errorMute) {
			request.sys.errorSys;
		}
	} else {
		request.sys.errorSys = new ErrorSys();
	}

	next();
}
