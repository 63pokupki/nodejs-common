

// Системные сервисы
import { ResponseSys } from './ResponseSys';
import { ErrorSys } from './ErrorSys';
import { MainRequest } from './MainRequest';

import { UserSys } from './UserSys';


/**
 * Базовый контроллер
 */
export default class BaseCtrl {

    public req: MainRequest;
    public errorSys: ErrorSys;
    public userSys: UserSys;
    public responseSys: ResponseSys;

    protected resp: any;

    constructor(req: MainRequest, resp: any){
        this.req = req;
        this.responseSys = req.sys.responseSys;
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        this.resp = resp;
    }

    protected fClassName() {
        return this.constructor.name;
    }

    /**
     *
     * @param msg - Сообщение
     * @param cbAction - Анонимная функция для вызова действия
     */
    public async faAction(msg:string, cbAction:Function){

        let out = null;
        if(this.errorSys.isOk()){
			out = await cbAction();
		} else {
			this.resp.status(401);
			this.errorSys.error('init_ctrl', 'Авторизация или активация провалились')
		}

		this.resp.send(
			this.responseSys.response(out, msg)
		);
    }


}