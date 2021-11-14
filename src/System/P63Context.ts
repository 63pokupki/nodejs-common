// /* eslint-disable @typescript-eslint/ban-types */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// import {
// 	UserSys, ResponseSys, LogicSys, CacheSys
// } from '@63pokupki/nodejs-common';
// import { SeoBase } from '@63pokupki/nodejs-common/lib/Components/Seo';
// import { AccessSys } from '@63pokupki/nodejs-common/lib/System/AccessSys';
// import { ErrorSys } from '@a-a-game-studio/aa-components';
// import Knex from 'knex';
// import { AAContext } from './AAContext';

// import { Response, NextFunction } from 'express';

// import axios from 'axios';

// /**
//  * Обработчик ошибок выполнения
//  * @param err - обязательно instanceof Error()
//  * @param ctx
//  * @param ctx
//  * @param next
//  */
// export const fErrorHandler = (err: Error, ctx:P63Context): void => {
// 	// const mattermostSys = new Mattermost.MattermostSys(<any>ctx);

// 	let ifDevMode = false;
// 	if (ctx.common.env === 'dev' || ctx.common.env === 'local') {
// 		ifDevMode = true;
// 	}

// 	if (err.name === 'AuthError') {
// 		ctx.status(500);
// 		// req.sys.errorSys.error('AuthError', 'Ошибка авторизации');
// 	} else if (err.name === 'ValidationError') {
// 		ctx.status(200);
// 		ctx.sys.errorSys.error('ValidationError', err.message);
// 	} else if (err.name === 'AppError') {
// 		ctx.status(500);
// 		if (ctx.common.env !== 'local') {
// 			// mattermostSys.sendErrorMsg(ctx.sys.errorSys, err, err.message);
// 		}
// 	} else {
// 		ctx.status(500);
// 		/* у нас в err что-то не то */
// 		ctx.sys.errorSys.error('server_error', 'Ошибка сервера');
// 		// mattermostSys.sendErrorMsg(ctx.sys.errorSys, err, `${String(err)}`);
// 	}

// 	if (ifDevMode) {
// 		console.log(
// 			'=================================== \r\n',
// 			`err.msg: ${err.message}`,
// 			'\r\n',
// 			'err.stack: \r\n ',
// 			'----------------------------------- \r\n',
// 			err.stack,
// 			'\r\n',
// 			'----------------------------------- \r\n',
// 			'originalUrl:',
// 			ctx.req.url,
// 			'\r\n',
// 			'=================================== \r\n',
// 			'\r\n',
// 		);
// 	}

// 	const arrError = ctx.sys.errorSys.getErrors();

// 	const vErrorForAPI = { // собираем ошибку
// 		api_key: ctx.sys.apikey || null,
// 		type: 'backend',
// 		env: ctx.common.env || null,
// 		user_id: ctx.sys.userSys.idUser || null,
// 		url: ctx.req.url || null,
// 		message: err.message || null,
// 		stack: err.stack || null,
// 		request_body: JSON.stringify(ctx.body) || null,
// 		fields: JSON.stringify(arrError),
// 	};

// 	try { // отправка ошибки в апи
// 		// axios.post(ctx.common.hook_url_errors_api, vErrorForAPI);
// 	} catch (e) {
// 		console.warn(e, 'Не удалось отправить ошибку');
// 	}

// 	ctx.send(
// 		JSON.stringify(ctx.sys.responseSys.response(null, err.message)),
// 	);
// };

// /**
//  * Функция рендера страницы
//  * @param faCallback - функция контролера
//  */
// export const faSendRouter = (faCallback: Function) => async (ctx:P63Context): Promise<void> => {
// 	try {
// 		await faCallback(ctx);
// 	} catch (e) {
// 		fErrorHandler(e, ctx);
// 	}
// };

// export class P63Context extends AAContext {
// 	headers: {
// 		[key: string]: any;
// 	} = <any>{};

// 	body: any = null;

// 	method: string;

// 	auth: {
// 		algorithm: string;
// 		secret: string;
// 	} = <any>{};

// 	common: {
// 		env: string;
// 		oldCoreURL: string;
// 		nameApp: string;
// 		errorMute: boolean;
// 		hook_url_errors: string;
// 		hook_url_monitoring: string;
// 		hook_url_front_errors: string;
// 		hook_url_errors_api: string;
// 		port: number;
// 	} = <any>{};

// 	sys: {
// 		apikey: string;
// 		bAuth: boolean;
// 		bMasterDB: boolean;
// 		bCache?: boolean;
// 		errorSys: ErrorSys;
// 		userSys: UserSys;
// 		responseSys: ResponseSys;
// 		logicSys: LogicSys;
// 		cacheSys: CacheSys;
// 		accessSys: AccessSys;
// 		seo?: SeoBase;
// 	} = <any>{};

// 	infrastructure: {
// 		mysql: Knex;
// 		mysqlMaster: Knex;
// 		sphinx?: Knex;
// 		redis: any;
// 		rabbit: any;
// 		sphinxErrors?: Knex;
// 	} = <any>{};
// }
