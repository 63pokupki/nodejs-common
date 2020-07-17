import { MainRequest } from './MainRequest';
import express = require('express');
/**
 * Функция рендера страницы
 * @param faCallback - функция контролера
 */
export declare const faSendRouter: (faCallback: Function) => (req: MainRequest, res: express.Response, next: any) => Promise<void>;
/**
 * Системный сервис формирования ответа
 */
export declare class ResponseSys {
    private env;
    private req;
    private ifDevMode;
    private errorSys;
    constructor(req: MainRequest);
    /**
     * Формирование ответа клиенту
     *
     * @param array|null data
     * @param string sMsg
     * @return array
     */
    response(data: any, sMsg: string): any;
}
