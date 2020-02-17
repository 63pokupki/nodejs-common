import * as express from 'express';
import { MainRequest, Mattermost } from '..';


/**
 * Обработчик ошибок выполнения
 * @param err - обязательно instanceof Error()
 * @param req
 * @param res
 * @param next
 */
export const fErrorHandler = (err: Error, req: MainRequest, res: express.Response, next: express.NextFunction) => {
	const mattermostSys = new Mattermost.MattermostSys(req);

	let ifDevMode = false;
	if (req.conf.common.env !== 'prod') {
		ifDevMode = true;
	}


	if (err.name == 'AuthError') {

		// req.sys.errorSys.error('AuthError', 'Ошибка авторизации');

	} else if (err.name == 'ValidationError') {
		req.sys.errorSys.error('ValidationError', 'Ошибка валидации');
	} else if (err.name == 'AppError') {
		if (req.conf.common.env !== 'local') {
			mattermostSys.sendErrorMsg(req.sys.errorSys, err, err.message);
		}
		if (ifDevMode) {
			console.log(
				'=================================== \r\n',
				`err.msg: ${err.message}`, '\r\n',
				'err.stack: \r\n ',
				'----------------------------------- \r\n',
				err.stack, '\r\n',
				'----------------------------------- \r\n',
				'originalUrl:', req.originalUrl, '\r\n',
				'=================================== \r\n',
				'\r\n',
			);
		}
	} else {
		/* у нас в err что-то не то */
		req.sys.errorSys.error('server_error', 'Ошибка сервера');
		mattermostSys.sendErrorMsg(req.sys.errorSys, err, `${String(err)} Кривой формат ошибки`);
	}

	/*
	// Для выписок
	if (err instanceof ValidationError) {
	const responseSys = new System.ResponseSys(req);
	res.status(200).send(responseSys.response(err, 'Ошибка'));
	next();
	} else next(err); */



	res.status(500);
	res.send(
		req.sys.responseSys.response(null, err.message),
	);

	// next(err);
};
