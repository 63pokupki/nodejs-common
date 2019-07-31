

// Системные сервисы
import { ResponseSys } from './ResponseSys';
import { ErrorSys } from './ErrorSys';
import MainRequest from './MainRequest';

import { UserSys } from './UserSys';


/**
 * SQL Запросы
 */
export default class BaseCtrl {

    public req: MainRequest;
    public errorSys: ErrorSys;
    public userSys: UserSys;
    public responseSys: ResponseSys;

    constructor(req: MainRequest) {

        this.req = req;
        this.responseSys = req.sys.responseSys;
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }

}
