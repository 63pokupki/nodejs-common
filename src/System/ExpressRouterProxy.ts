import { Router, Response, Request, NextFunction } from 'express';
import { promisify } from '../Utils/PromiseUtil';

export interface ControllerClass<TCtrl> {
	new(req: Request, res: Response): TCtrl;
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
 * Оборачивает в try/catch создание контроллера и вызов обработчика роута
 * По умолчанию отправляет в ответ сериализованное значение возвращенное обработчиком
 * Но можно отнаследоваться и переопределить метод buildResponse, чтобы изменить логику ответа
 * Также у наследника можно изменить логику инициализации контроллера перед вызовом обработчика переопределить метод initializeController
 */
export class ExpressRouterProxy<TCtrl = {}, TCtrlClass extends ControllerClass<TCtrl> = ControllerClass<TCtrl>> {
	controllerClass: TCtrlClass | undefined;

	router: Router;

	constructor(controllerClass?: TCtrlClass) {
		this.controllerClass = controllerClass;
		this.router = Router();
	}

	get<TReqData, TResData, THandlerOptions>(
		url: string,
		handlerDefinition: HandlerDefinition<TCtrl, TReqData, TResData, THandlerOptions>,
		options?: THandlerOptions,
	) {
		this.router.get(url, async (req: Request, res: Response, next: NextFunction) => {
			await this.runMethod(handlerDefinition, req.params as any, req, res, next, options);
		});
	}

	post<TReqData, TResData, THandlerOptions>(
		url: string,
		handlerDefinition: HandlerDefinition<TCtrl, TReqData, TResData, THandlerOptions>,
		options?: THandlerOptions,
	) {
		this.router.post(url, async (req: Request, res: Response, next: NextFunction) => {
			await this.runMethod(handlerDefinition, req.body, req, res, next, options);
		});
	}

	private async runMethod<TReqData, TResData, THandlerOptions>(
		handlerDefinition: HandlerDefinition<TCtrl, TReqData, TResData, THandlerOptions>,
		data: TReqData,
		req: Request,
		res: Response,
		next: NextFunction,
		options?: THandlerOptions,
	) {
		try {
			const ctrl = await this.initializeController(req, res, next, options);
			const context = {
				req,
				res,
				next,
				ctrl,
				options,
			};
			const handler = handlerDefinition(ctrl);
			const handlerResult = handler.call(ctrl, data, context) as TResData;
			const responseData = await promisify(handlerResult);
			await this.buildResponse(responseData, context);
			if(!res.headersSent) { // Check if response was provided
				next(new Error('No content'));
			} else {
				next()
			}
		} catch (error) {
			next(error);
		}
	}

	protected initializeController<THandlerOptions>(
		req: Request,
		res: Response,
		next: NextFunction,
		options: THandlerOptions,
	): Promise<TCtrl> {
		const { controllerClass: CtrlCtor } = this;
		if (!CtrlCtor) {
			return Promise.resolve(null);
		}
		return Promise.resolve(new CtrlCtor(req, res));
	}

	protected buildResponse<THandlerOptions = undefined>(
		responseData: any,
		context: HandlerContext<TCtrl, THandlerOptions>,
	): Promise<any> {
		context.res.send(JSON.stringify(responseData))
		return Promise.resolve();
	}
}
