"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devReq = {
    headers: {},
    body: null,
    method: null,
    sys: {
        apikey: null,
        bAuth: null,
        errorSys: null,
        userSys: null,
        responseSys: null,
    },
    conf: {
        mysql: {
            client: '',
            connection: {
                host: '',
                user: '',
                password: '',
                database: '',
            },
            pool: { min: 0, max: 0 },
            migrations: {
                tableName: '',
                directory: '',
            },
            acquireConnectionTimeout: 0,
        },
        pgsql: {
            dialect: '',
            username: '',
            password: '',
            host: '',
            port: 0,
            database: '',
            dialectOptions: {
                supportBigNumbers: true,
                decimalNumbers: true,
            }
        },
        redis: {
            url: '',
        },
        common: {
            env: '',
            oldCoreURL: '',
        },
        rabbit: {
            connection: '',
        },
        S3: {
            endpoint: '',
            bucket: '',
            baseUrl: '',
            access: '',
            secret: '',
        }
    }
};
//# sourceMappingURL=MainRequest.js.map