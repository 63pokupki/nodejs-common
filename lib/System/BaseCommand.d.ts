import { ErrorSys } from './ErrorSys';
import MainRequest from './MainRequest';
import { UserSys } from './UserSys';
/**
 * Конструктор для консольных комманд
 */
export default class BaseCommand {
    db: any;
    errorSys: ErrorSys;
    userSys: UserSys;
    constructor(req: MainRequest);
}
