import { MainRequest } from './MainRequest';
import { UserSys } from './UserSys';
import { ErrorSys } from './ErrorSys';
/**
 * Система логическая система
 * Логические функции управления приложением
 */
export declare class LogicSys {
    protected errorSys: ErrorSys;
    protected userSys: UserSys;
    protected req: MainRequest;
    constructor(req: MainRequest);
    /**
     * Включить запросы на базу данных
     */
    fMasterDBOn(): void;
    /**
     * Отключить запросы на мастер базу данных
     */
    fMasterDBOff(): void;
    /**
     * Блок для выполнения запросов на мастер базу данных
     * @param callback - функция содержащая логическую операцию
     */
    faQueryMasterDB(callback: Function): Promise<any>;
}
