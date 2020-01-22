import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { MainRequest } from './MainRequest';
import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';
/**
 * Базовая модель
 */
export default class BaseM {
    errorSys: ErrorSys;
    userSys: UserSys;
    req: MainRequest;
    logicSys: LogicSys;
    cacheSys: CacheSys;
    constructor(req: MainRequest);
}
