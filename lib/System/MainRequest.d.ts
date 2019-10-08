import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';
import { Request } from 'express';
import { SeoBase } from '../Components/Seo';
import { MainConfig } from './MainConfig';
export default interface MainRequest extends Request {
    headers: {
        [key: string]: any;
    };
    body: any;
    method: string;
    sys: {
        apikey: string;
        bAuth: boolean;
        errorSys: ErrorSys;
        userSys: UserSys;
        responseSys: ResponseSys;
        seo?: SeoBase;
    };
    conf: MainConfig;
    infrastructure: {
        mysql: any;
        redis: any;
        rabbit: any;
    };
}
export declare const devReq: MainRequest;
/**
 * Инициализация MainRequest для консольных запросов
 */
export declare function initMainRequest(conf: any): MainRequest;
