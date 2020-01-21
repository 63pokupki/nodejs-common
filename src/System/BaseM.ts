// Системные сервисы
import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { MainRequest } from './MainRequest';
import { LogicSys } from './LogicSys';

/**
 * Базовая модель
 */
export default class BaseM {

    public errorSys: ErrorSys;
    public userSys: UserSys;
	public req: MainRequest;
	public logicSys:LogicSys;

    constructor(req: MainRequest) {
        this.errorSys = req.sys.errorSys;
		this.userSys = req.sys.userSys;
		this.logicSys = req.sys.logicSys;
        this.req = req;
    }

}
