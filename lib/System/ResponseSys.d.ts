import MainRequest from './MainRequest';
export declare class ResponseSys {
    private env;
    private ifDevMode;
    private errorSys;
    constructor(req: MainRequest);
    response(data: any, sMsg: string): any;
}
