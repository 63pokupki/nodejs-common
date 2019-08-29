import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';
import { Request } from 'express';
import { SeoBase } from '../Components/Seo';
import { SeoConfigI } from '../Components/Seo';
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
    conf: {
        mysql: {
            client: string;
            connection: {
                host: string;
                user: string;
                password: string;
                database: string;
            };
            pool: {
                min: number;
                max: number;
            };
            migrations: {
                tableName: string;
                directory: string;
            };
            acquireConnectionTimeout: number;
        };
        pgsql: {
            dialect: string;
            username: string;
            password: string;
            host: string;
            port: number;
            database: string;
            dialectOptions: {
                supportBigNumbers: true;
                decimalNumbers: true;
            };
        };
        redis: {
            url: string;
        };
        common: {
            env: string;
            oldCoreURL: string;
        };
        rabbit: {
            connection: string;
        };
        S3: {
            endpoint: string;
            bucket: string;
            baseUrl: string;
            access: string;
            secret: string;
        };
        SeoConfig?: SeoConfigI;
    };
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
