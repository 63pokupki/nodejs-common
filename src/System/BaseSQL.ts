
// Глобальные сервисы


// Системные сервисы
import { ErrorSys } from './ErrorSys';
import { RedisSys } from './RedisSys';
import MainRequest from './MainRequest';

import { ModelValidatorSys } from './ModelValidatorSys';
import { UserSys } from './UserSys';


/**
 * SQL Запросы
 */
export default class BaseSQL {

    protected db: any;
    protected redisSys: RedisSys;

    protected modelValidatorSys: ModelValidatorSys;
    protected errorSys: ErrorSys;
    protected userSys: UserSys;

    constructor(req: MainRequest) {

        this.modelValidatorSys = new ModelValidatorSys(req);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;

        if( req.infrastructure.mysql ){
            this.db = req.infrastructure.mysql;
        } else {
            this.errorSys.error('db_no_connection', 'Отсутствует подключение к mysql');
        }

        if( req.infrastructure.redis ){
            this.redisSys = req.infrastructure.redis;
        } else {
            this.errorSys.error('db_redis', 'Отсутствует подключение к redis');
        }
    }
}
