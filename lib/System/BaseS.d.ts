import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import MainRequest from './MainRequest';
/**
 * Клас для сервисов которые проксируют запросы к базе данных
 * объединяют под различные запросы SQL под единой логикой службы
 * автоматизируют рутинные операции
 */
export default class BaseS {
    errorSys: ErrorSys;
    userSys: UserSys;
    req: MainRequest;
    constructor(req: MainRequest);
}
