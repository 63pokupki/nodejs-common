
// Глобальные сервисы


// Системные сервисы
import { ErrorSys } from './ErrorSys';
import { RedisSys } from './RedisSys';
import MainRequest from './MainRequest';

import { ModelValidatorSys } from './ModelValidatorSys';
import { UserSys } from './UserSys';
import { isObject, isArray } from 'util';


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
        let out:any = null;
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
            out = await callback();

            if( out && (isObject(out) || isArray(out)) ){
                this.redisSys.set(
                    sKey,
                    JSON.stringify(out),
                    iTimeSec
                );
            } else {
                this.errorSys.devNotice(
                    sKey, 'Не удалось посместить значение в кеш'
                );
            }
        }

        if( ok && bCache ){ // Если значение взято из кеша - отдаем его в ответ
            out = JSON.parse(sCache);
        }

        return out;

    }

    /**
     * Авто кеширование int переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCacheInt(sKey:string, iTimeSec:number, callback:any):Promise<number>{

        let ok = this.errorSys.isOk();

        let bCache = false; // Наличие кеша

        let sCache = null;
        let out:number = null;
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
            out = Number(await callback());
            if(out || out === 0){
                this.redisSys.set(
                    sKey,
                    String(out),
                    iTimeSec
                );
            } else {
                this.errorSys.devWarning(
                    sKey, 'Неверный тип, должен быть number => ' + out
                );
            }
        }

        if( ok && bCache ){ // Если значение взято из кеша - отдаем его в ответ
            out = Number(sCache);
        }

        return out;
    }

    /**
     * Авто кеширование ID переменной для встраивания в функцию
     * @param sKey - Ключ кеша
     * @param iTimeSec - Время кеширования
     * @param callback - функция получающая данные из БД
     */
    async autoCacheID(sKey:string, iTimeSec:number, callback:any):Promise<number>{

        let ok = this.errorSys.isOk();

        let bCache = false; // Наличие кеша

        let sCache = null;
        let out:number = null;
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
            out = Number(await callback());
            if(out || out > 0){
                this.redisSys.set(
                    sKey,
                    String(out),
                    iTimeSec
                );
            } else {
                this.errorSys.devWarning(
                    sKey, 'Неверный тип, должен быть number => ' + out
                );
            }
        }

        if( ok && bCache ){ // Если значение взято из кеша - отдаем его в ответ
            out = Number(sCache);
        }

        return out;
    }

    /**
     * Очистить кеш редиса
     * @param sKey
     */
    async clearCache(sKey:string){
        let aKeyList = await this.redisSys.keys(sKey);
        this.redisSys.del(aKeyList);
    }

}
