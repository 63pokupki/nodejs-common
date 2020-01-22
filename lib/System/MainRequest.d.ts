import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';
import { Request } from 'express';
import { SeoBase } from '../Components/Seo';
import { MainConfig } from './MainConfig';
import { DbProvider } from './DbProvider';
import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';
export interface MainRequest extends Request {
    headers: {
        [key: string]: any;
    };
    body: any;
    method: string;
    sys: {
        apikey: string;
        bAuth: boolean;
        bMasterDB: boolean;
        errorSys: ErrorSys;
        userSys: UserSys;
        responseSys: ResponseSys;
        logicSys: LogicSys;
        cacheSys: CacheSys;
        seo?: SeoBase;
    };
    conf: MainConfig;
    infrastructure: {
        mysql: any;
        mysqlMaster: any;
        dbProvider: DbProvider;
        redis: any;
        rabbit: any;
    };
    errorType?: number;
}
export declare const devReq: MainRequest;
/**
 * Инициализация MainRequest для консольных запросов
 */
export declare function initMainRequest(conf: any): MainRequest;
/**
 * Типы ошибок
 */
export declare enum TError {
    None = 0,
    PageNotFound = 404,
    Api = 1,
    AllBad = 500,
    AccessDenied = 403
}
