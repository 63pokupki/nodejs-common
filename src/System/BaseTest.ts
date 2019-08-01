
// Глобальные сервисы


// Системные сервисы
import { ErrorSys } from './ErrorSys';
import { RedisSys } from './RedisSys';
import MainRequest from './MainRequest';

import { UserSys } from './UserSys';

/**
 * Класс конструктор для тестов
 */
export default class BaseTest {

    protected db: any; // База данных основного сайта

    protected errorSys: ErrorSys;
    protected userSys: UserSys;

    constructor(req: MainRequest) {

        this.db = require('knex')(req.conf.mysql);

        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }

}
