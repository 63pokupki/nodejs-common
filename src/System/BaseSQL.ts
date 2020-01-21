
// Глобальные сервисы
import { isObject, isArray } from 'util';
import Knex = require('knex')

// Системные сервисы
import { ErrorSys } from './ErrorSys';
import { RedisSys } from './RedisSys';
import { MainRequest } from './MainRequest';

import { ModelValidatorSys } from './ModelValidatorSys';
import { UserSys } from './UserSys';
import { DbProvider } from './DbProvider';

/**
 * SQL Запросы
 */
export default class BaseSQL {

	/**
	 * Получаем базу данных для выполнения запроса
	 * В зависимости от bMasterDB
	 * может быть масте БД или балансировщик
	 */
	protected get db(): Knex{
		let db = null;
		if(this.req.sys.bMasterDB){
			db = this.dbMaster;
		} else {
			db = this.dbBalancer;
		}
		return db;
	};

	protected dbMaster: Knex;
	protected dbBalancer: Knex;


    /**
     * Отличие между dbProvider и db заключается в том,
     * что dbProvider умеет переключать поле current на транзакцию
     * и обратно после завешения транзакции
     *
     * Т.е. если в SQL классах использовать this.dbProvider.current вместо this.db
     * такой класс можно будет вызвать как внутри транзакции, так и отдельно
     */
    protected dbProvider: DbProvider;
    protected redisSys: RedisSys;

    protected modelValidatorSys: ModelValidatorSys;
    protected errorSys: ErrorSys;
	protected userSys: UserSys;
	protected req:MainRequest;

    constructor(req: MainRequest) {
		this.req = req;

        this.modelValidatorSys = new ModelValidatorSys(req);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;

        this.dbProvider = req.infrastructure.dbProvider;
        if( req.infrastructure.mysql ){
            this.dbBalancer = req.infrastructure.mysql;
        } else {
            this.errorSys.error('db_no_connection', 'Отсутствует подключение к mysql');
		}

		if( req.infrastructure.mysqlMaster ){
            this.dbMaster = req.infrastructure.mysqlMaster;
        } else {
            this.errorSys.error('db_master_no_connection', 'Отсутствует подключение к mysql мастеру');
		}


        if( req.infrastructure.redis ){
            this.redisSys = req.infrastructure.redis;
        } else {
            this.errorSys.error('db_redis', 'Отсутствует подключение к redis');
        }
    }

    /**
     * Выполнить запросы в транзакции
     *
     * Для того чтобы вызываемые в func методы работали через транзакцию
     * нужно в SQL файлах вместо this.db использовать this.dbProvider.current
     */
    async transaction<T>(func: () => Promise<T>) {
        const result = await this.dbProvider.transaction(func);
        return result
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
