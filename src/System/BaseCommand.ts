
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

    public db: any;

    public errorSys: ErrorSys;
    public userSys: UserSys;

    constructor(req: MainRequest) {

        this.db = require('knex')(req.conf.mysql);

        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }

}
