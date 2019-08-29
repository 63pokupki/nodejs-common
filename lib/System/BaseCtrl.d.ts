import { ResponseSys } from './ResponseSys';
import { ErrorSys } from './ErrorSys';
import MainRequest from './MainRequest';
import { UserSys } from './UserSys';
/**
 * SQL Запросы
 */
export default class BaseCtrl {
    req: MainRequest;
    errorSys: ErrorSys;
    userSys: UserSys;
    responseSys: ResponseSys;
    constructor(req: MainRequest);
}
