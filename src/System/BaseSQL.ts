
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


    /**
     * Авто кеширование для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCache(sKey:string, iTimeSec:number, callback:any):Promise<any>{

        let ok = this.errorSys.isOk();

        let bCache = false; // Наличие кеша

        let sCache = null;
        let out:any;
        if( ok ){ // Пробуем получить данные из кеша
            sCache = await this.redisSys.get(sKey);

            if( sCache ){
                bCache = true;
                this.errorSys.devNotice(
                    sKey, 'Значение взято из кеша'
                );
            }
        }

        if( ok && !bCache ){ // Если значения нет в кеше - добавляем его в кеш
            this.redisSys.set(
                sKey,
                JSON.stringify(await callback()),
                iTimeSec
            );
        }

        if( ok && bCache ){ // Если значение взято из кеша - отдаем его в ответ
            out = JSON.parse(sCache);
        }

        return out;

    }
}
