// Системные сервисы
import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { MainRequest } from './MainRequest';
import { LogicSys } from './LogicSys';

/**
 * Класс для сервисов которые проксируют запросы к базе данных
 * объединяют под различные запросы SQL под единой логикой службы
 * автоматизируют рутинные операции
 */
export default class BaseS {

    public errorSys: ErrorSys;
    public userSys: UserSys;
	public req: MainRequest;
	public logicSys:LogicSys;

    constructor(req: MainRequest) {
        this.errorSys = req.sys.errorSys;
		this.userSys = req.sys.userSys;
		this.logicSys = req.sys.logicSys;
		this.req = req;
    }

}
