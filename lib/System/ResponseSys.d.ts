import MainRequest from './MainRequest';
/**
 * Системный сервис формирования ответа
 */
export declare class ResponseSys {
    private env;
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
