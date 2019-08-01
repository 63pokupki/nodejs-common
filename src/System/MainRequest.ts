import { ErrorSys } from './ErrorSys';
import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';

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
