
// Глобальные сервисы


// Системные сервисы
import { ErrorSys } from './ErrorSys';
import { RedisSys } from './RedisSys';
import MainRequest from './MainRequest';



import { UserSys } from './UserSys';

/**
 * Конструктор для консольных комманд
 */
export default class BaseCommand {

    protected db: any;

    protected errorSys: ErrorSys;
    protected userSys: UserSys;

    constructor(req: MainRequest) {

        this.db = require('knex')(req.conf.mysql);

        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }

}
