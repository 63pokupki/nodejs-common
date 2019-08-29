import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import MainRequest from './MainRequest';
/**
 * Базовая модель
 */
export default class BaseM {
    errorSys: ErrorSys;
    userSys: UserSys;
    req: MainRequest;
    constructor(req: MainRequest);
}
