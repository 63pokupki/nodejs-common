import { Router, Response, Request, NextFunction } from 'express';
export interface ControllerClass<TCtrl> {
    new (req: Request, res: Response): TCtrl;
}
export interface HandlerDefinition<TCtrl, TReqData, TResData, THandlerOptions> {
    (ctrl: TCtrl): Handler<TCtrl, TReqData, TResData, THandlerOptions>;
}
export interface Handler<TCtrl, TReqData, TResData, THandlerOptions> {
    (data: TReqData, context: HandlerContext<TCtrl, THandlerOptions>): Promise<TResData> | TResData;
}
export interface HandlerContext<TCtrl, THandlerOptions = undefined> {
    req: Request;
    res: Response;
    next: NextFunction;
    ctrl: TCtrl;
    options?: THandlerOptions;
}
/**
 * Оборачивает в try/catch создание контроллера и вызов обработчика роута,
 * чтобы не приходилось это делать в коде каждого обработчика роута
 *
 * По умолчанию отправляет в ответ сериализованное значение возвращенное обработчиком
 * Но можно отнаследоваться и переопределить метод buildResponse, чтобы изменить логику ответа
 *
 * По умолчанию если передан класс контроллера, то экземпляр класса контроллера создается через new
 * но можно изменить логику инициализации контроллера перед вызовом обработчика
 * переопределив метод initializeController
 * в нем можно добавить дополнительные действия по инициализации, например проверку прав доступа
 */
export declare class ExpressRouterProxy<TCtrl = {}, TCtrlClass extends ControllerClass<TCtrl> = ControllerClass<TCtrl>> {
    controllerClass: TCtrlClass | undefined;
    router: Router;
    constructor(controllerClass?: TCtrlClass);
    get<TReqData, TResData, THandlerOptions>(url: string, handlerDefinition: HandlerDefinition<TCtrl, TReqData, TResData, THandlerOptions>, options?: THandlerOptions): void;
    post<TReqData, TResData, THandlerOptions>(url: string, handlerDefinition: HandlerDefinition<TCtrl, TReqData, TResData, THandlerOptions>, options?: THandlerOptions): void;
    private runMethod;
    protected initializeController<THandlerOptions>(req: Request, res: Response, next: NextFunction, options: THandlerOptions): Promise<TCtrl>;
    protected buildResponse<THandlerOptions = undefined>(responseData: any, context: HandlerContext<TCtrl, THandlerOptions>): Promise<any>;
}
