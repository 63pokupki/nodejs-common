import {ErrorSys} from './ErrorSys';
import {UserSys} from './UserSys';
import {ResponseSys} from './ResponseSys';

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
    conf: {
        mysql: any; // Конфиг для MySql
        pgsql: any; // Конфиг для Postgress
        redis: any; // Конфиг для редиса
        common: { // Общее
            env:string; // Тип окружения
        }
    }
}