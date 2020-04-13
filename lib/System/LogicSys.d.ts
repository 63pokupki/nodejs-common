import { MainRequest } from './MainRequest';
import { UserSys } from './UserSys';
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
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
     * Включить кеш редиса
     */
    fCacheOn(): void;
    /**
     * Выключить кеш редиса
     */
    fCacheOff(): void;
    /**
     * Логический блок
     * @param sError - Сообщение об ощибке
     * @param callback - функция содержащая логическую операцию
     */
    ifOk(sError: string, callback: Function): Promise<any>;
    /**
     * Блок для выполнения запросов на мастер базу данных
     * @param callback - функция содержащая логическую операцию
     */
    faQueryMasterDB(sError: string, callback: Function): Promise<any>;
}
