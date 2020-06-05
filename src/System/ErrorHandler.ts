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
	if (req.conf.common.env === 'dev' || req.conf.common.env === 'local') {
		ifDevMode = true;
	}


	if (err.name == 'AuthError') {
		res.status(500);
		// req.sys.errorSys.error('AuthError', 'Ошибка авторизации');

	} else if (err.name == 'ValidationError') {
		res.status(200);
		req.sys.errorSys.error('ValidationError', err.message);
	} else if (err.name == 'AppError') {
		res.status(500);
		if (req.conf.common.env !== 'local') {
			mattermostSys.sendErrorMsg(req.sys.errorSys, err, err.message);
		}
	} else {
		res.status(500);
		/* у нас в err что-то не то */
		req.sys.errorSys.error('server_error', 'Ошибка сервера');
		mattermostSys.sendErrorMsg(req.sys.errorSys, err, `${String(err)}`);
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

	res.send(
		req.sys.responseSys.response(null, err.message),
	);

};
