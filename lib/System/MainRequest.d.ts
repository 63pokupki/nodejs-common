import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';
export default interface MainRequest {
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
    };
}