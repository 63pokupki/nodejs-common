import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';

import { RedisSys } from './RedisSys';

export default interface MainRequest {
    headers: { [key: string]: any };
    body: any;
    method: string;
    sys: {
        apikey: string,
        bAuth: boolean, /* флаг авторизации */

        errorSys: ErrorSys,
        userSys: UserSys,
        responseSys: ResponseSys,
    };
    conf: { // Конфигурация
        // ================================
        mysql: { // Конфиг для MySql
            client: string, // mysql
            connection: { // Параметры соединения
                host: string; // "127.0.0.1"
                user: string; // Пользователь
                password: string; // Пароль
                database: string; // Имя базы данных
            },
            pool: { min: number, max: number }, // Количество соединений
            migrations: {
                tableName: string; // "knex_migrations",
                directory: string; // "./src/Infrastructure/SQL/Migrations"
            },
            acquireConnectionTimeout: number; // таймоут 60000
        };
        // ================================
        pgsql: { // Конфиг для Postgress
            dialect: string; // "postgres",
            username: string; // Имя пользователя,
            password: string; // Пароль
            host: string; // "127.0.0.1",
            port: number; // 5432,
            database: string; // Имя базы данных
            dialectOptions: {
                supportBigNumbers: true;
                decimalNumbers: true;
            }
        };
        // ================================
        redis: { // Конфиг для редиса
            url: string; // "redis://127.0.0.1:6379"
        };
        // ================================
        common: { // Общее
            env: string; // Тип окружения
            oldCoreURL: string; // URL адрес основного сайта
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
        }
    }


}


export const devReq: MainRequest = {
    headers: {  },
    body: null,
    method: null,
    sys: {
        apikey: null,
        bAuth: null,

        errorSys: null,
        userSys: null,
        responseSys: null,
    },
    conf: { // Конфигурация
        // ================================
        mysql: { // Конфиг для MySql
            client: '', // mysql
            connection: { // Параметры соединения
                host: '', // "127.0.0.1"
                user: '', // Пользователь
                password: '', // Пароль
                database: '', // Имя базы данных
            },
            pool: { min: 0, max: 0 }, // Количество соединений
            migrations: {
                tableName: '', // "knex_migrations",
                directory: '', // "./src/Infrastructure/SQL/Migrations"
            },
            acquireConnectionTimeout: 0, // таймоут 60000
        },
        // ================================
        pgsql: { // Конфиг для Postgress
            dialect: '', // "postgres",
            username: '', // Имя пользователя,
            password: '', // Пароль
            host: '', // "127.0.0.1",
            port: 0, // 5432,
            database: '', // Имя базы данных
            dialectOptions: {
                supportBigNumbers: true,
                decimalNumbers: true,
            }
        },
        // ================================
        redis: { // Конфиг для редиса
            url: '', // "redis://127.0.0.1:6379"
        },
        // ================================
        common: { // Общее
            env: '', // Тип окружения
            oldCoreURL: '', // URL адрес основного сайта
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

}



/**
 * Инициализация MainRequest для консольных запросов
 */
export async function initMainRequest(conf: any): Promise<MainRequest> {

    let mainRequest: MainRequest;

    mainRequest = devReq;
    mainRequest.conf = conf;

    mainRequest.sys.errorSys = new ErrorSys(mainRequest);

    /* юзерь не авторизован */
    const userSys = new UserSys(mainRequest);

    // Инициализируем систему для пользователей
    await userSys.init();

    mainRequest.sys.userSys;

    return mainRequest;
}
