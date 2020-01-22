import { MainRequest } from '../MainRequest';
import {ErrorSys} from '../ErrorSys';
import { LogicSys } from '../LogicSys';

/* LEGO ошибок */
export default function ErrorSysMiddleware(request: MainRequest, response: any, next: any) {

    request.sys = {
        apikey: '',
        errorSys: null,
        userSys: null,
		responseSys: null,
		logicSys: null,
		cacheSys: null,
		bAuth: false,
		bMasterDB:false
    }

    request.sys.errorSys = new ErrorSys(request);
    next();
}