"use strict";
const ErrorSys_1 = require('./ErrorSys');
const UserSys_1 = require('./UserSys');
const ResponseSys_1 = require('./ResponseSys');
MainRequest;
{
    headers: {
        [key, string];
        any;
    }
    ;
    body: any;
    method: string;
    sys: {
        apikey: string,
            bAuth;
        boolean,
            errorSys;
        ErrorSys_1.ErrorSys,
            userSys;
        UserSys_1.UserSys,
            responseSys;
        ResponseSys_1.ResponseSys,
        ;
    }
    ;
    conf: {
        mysql: {
            client: string,
                connection;
            {
                host: string;
                user: string;
                password: string;
                database: string;
            }
            pool: {
                min: number, max;
                number;
            }
            migrations: {
                tableName: string;
                directory: string;
            }
            acquireConnectionTimeout: number;
        }
        ;
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
            }
        }
        ;
        redis: {
            url: string;
        }
        ;
        common: {
            env: string;
            oldCoreURL: string;
        }
    }
}
//# sourceMappingURL=MainRequest.js.map