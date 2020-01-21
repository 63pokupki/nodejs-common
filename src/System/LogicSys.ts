

// Системные сервисы
import { MainRequest } from './MainRequest';

import { UserSys } from './UserSys';
import { ErrorSys } from './ErrorSys';


/**
 * Система логическая система
 * Логические функции управления приложением
 */
export class LogicSys {

    protected errorSys: ErrorSys;
	protected userSys: UserSys;
	protected req:MainRequest;

    constructor(req: MainRequest) {
		this.req = req;
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
	}

	/**
	 * Включить запросы на базу данных
	 */
	fMasterDBOn(){
		this.req.sys.bMasterDB = true;
	}

	/**
	 * Отключить запросы на мастер базу данных
	 */
	fMasterDBOff(){
		this.req.sys.bMasterDB = false;
	}

	/**
     * Блок для выполнения запросов на мастер базу данных
     * @param callback - функция содержащая логическую операцию
     */
    async faQueryMasterDB(callback:Function):Promise<any>{

		this.req.sys.bMasterDB = true;

        let out = null;
        if( this.errorSys.isOk() ){
            try{
                out = await callback();
            } catch(e) {
                throw e;
            }
        } else {
			this.errorSys.devWarning('query_master_db', ' - Не выполненно');
			throw Error('query_master_db');
		}

		this.req.sys.bMasterDB = false;

		return out;
    }
}