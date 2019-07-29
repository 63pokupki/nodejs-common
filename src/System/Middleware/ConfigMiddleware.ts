import MainRequest from '../MainRequest';
import {ErrorSys} from '../ErrorSys';
import * as config  from '../../Configs/MainConfig'

/* LEGO ошибок */
export default function ErrorSysMiddleware(request: MainRequest, response: any, next: any) {

    request.conf = {
        apikey: '',
        errorSys: null,
        userSys: null,
        responseSys: null,
        bAuth: false
    }

    request.sys.errorSys = new ErrorSys(request);
    next();
}