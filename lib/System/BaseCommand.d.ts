import { ErrorSys } from './ErrorSys';
import MainRequest from './MainRequest';
import { UserSys } from './UserSys';
export default class BaseCommand {
    db: any;
    errorSys: ErrorSys;
    userSys: UserSys;
    constructor(req: MainRequest);
}
