import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import MainRequest from './MainRequest';
export default class BaseS {
    errorSys: ErrorSys;
    userSys: UserSys;
    req: MainRequest;
    constructor(req: MainRequest);
}
