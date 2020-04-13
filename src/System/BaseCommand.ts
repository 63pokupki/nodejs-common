
// Глобальные сервисы


// Системные сервисы
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { RedisSys } from './RedisSys';
import { MainRequest } from './MainRequest';



import { UserSys } from './UserSys';

/**
 * Конструктор для консольных команд
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
