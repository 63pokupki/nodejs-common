import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { MainRequest } from './MainRequest';
import { LogicSys } from './LogicSys';
/**
 * Базовая модель
 */
export default class BaseM {
    errorSys: ErrorSys;
    userSys: UserSys;
    req: MainRequest;
    logicSys: LogicSys;
    constructor(req: MainRequest);
}
