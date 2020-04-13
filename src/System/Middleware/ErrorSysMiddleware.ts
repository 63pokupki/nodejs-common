import { MainRequest } from '../MainRequest';
import {ErrorSys} from '@a-a-game-studio/aa-components/lib';
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
		bMasterDB:false,
		bCache:true
    }
    if(request.conf){
        request.sys.errorSys = new ErrorSys(request.conf.common.env);
        if(request.conf.common.errorMute){
            request.sys.errorSys
        }
    } else {
        request.sys.errorSys = new ErrorSys();
    }

    
    
    next();
}