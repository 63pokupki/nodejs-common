import { ResponseSys } from './ResponseSys';
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { MainRequest } from './MainRequest';
import { UserSys } from './UserSys';
/**
 * Базовый контроллер
 */
export default class BaseCtrl {
    req: MainRequest;
    errorSys: ErrorSys;
    userSys: UserSys;
    responseSys: ResponseSys;
    protected resp: any;
    constructor(req: MainRequest, resp: any);
    protected fClassName(): string;
    /**
     *
     * @param msg - Сообщение
     * @param cbAction - Анонимная функция для вызова действия
     */
    faAction(msg: string, cbAction: Function): Promise<void>;
}
