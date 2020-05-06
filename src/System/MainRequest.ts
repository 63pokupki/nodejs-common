import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';

import { Request } from 'express';
import { SeoBase } from '../Components/Seo';
import { MainConfig } from './MainConfig';
import { DbProvider } from './DbProvider';
import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';



export interface MainRequest extends Request {
    headers: { [key: string]: any };
    body: any;
    method: string;

    sys: {
        apikey: string,
        sAppPath?: string, // путь старта приложения(назначается самим приложением)
		bAuth: boolean, /* флаг авторизации */
		bMasterDB: boolean, // Для запроса использовать мастер соединение
		bCache?: boolean, // Управление кешированием Вкл/Выкл

        errorSys: ErrorSys,
        userSys: UserSys,
		responseSys: ResponseSys,
		logicSys: LogicSys, // Система логики управления приложением
		cacheSys: CacheSys, // Система кеширования
        seo?: SeoBase;
    };
    conf: MainConfig,
    infrastructure: {
		mysql: any;
		mysqlMaster: any;
        dbProvider: DbProvider;
        redis: any;
        rabbit: any;
    },
    errorType?: number, // тип ошибки
}

const Req: any = {
    headers: null,
    common: { // Общее
        env: 'dev', // Тип окружения
		oldCoreURL: null, // URL адрес основного сайта
		nameApp:'default',
        errorMute: true,
        hook_url_errors: 'https://', // Сообщения об ошибках mattermost
        hook_url_monitoring: 'https://', // Сообщения мониторинга в mattermost
        port: 3005, // порт на котором будет работать нода
    },
    sys: {
        apikey: '',
		bAuth: false, /* флаг авторизации */
		bMasterDB: false, // По умолчанию используется maxScale
		bCache: true, // По умолчанию кеш используется

        errorSys: null, // Система ошибок
        userSys: null, // Система пользователя
		responseSys: null, // Система формирвания ответа
		logicSys: null, // Система логики управления приложением
		cacheSys: null, // Система кеширования
    },
    conf: null,
    infrastructure: {
		mysql: null, // коннект к балансеру БД
		mysqlMaster: null, // конект к мастеру
		redis: null,
		rabbit: null
    }
};


export const devReq = <MainRequest>Req;

/**
 * Инициализация MainRequest для консольных запросов
 */
export function initMainRequest(conf: any): MainRequest {

    let mainRequest: MainRequest;

    mainRequest = devReq;
    mainRequest.conf = conf;

    mainRequest.sys.errorSys = new ErrorSys(conf.common.env);
    if(conf.common.errorMute){ // Настройка режим тищины
        mainRequest.sys.errorSys.option({
            bMute:true
        })
    }

    return mainRequest;
}

/**
 * Типы ошибок
 */
export enum TError {
    None = 0,
    PageNotFound = 404,
    Api = 1,
    AllBad = 500,
    AccessDenied = 403,
}