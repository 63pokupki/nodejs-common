import { Response, NextFunction } from 'express';
import { MainRequest, Mattermost } from '..';
import axios from 'axios';

/**
 * Обработчик ошибок выполнения
 * @param err - обязательно instanceof Error()
 * @param req
 * @param res
 * @param next
 */
export const fErrorHandler = (err: Error, req: MainRequest, res: Response, next: NextFunction): void => {
	// const mattermostSys = new Mattermost.MattermostSys(req);

	let ifDevMode = false;
	if (req.common.env === 'dev' || req.common.env === 'local') {
		ifDevMode = true;
	}

	if (err.name === 'AuthError') {
		res.status(500);
		// req.sys.errorSys.error('AuthError', 'Ошибка авторизации');
	} else if (err.name === 'ValidationError') {
		res.status(200);
		req.sys.errorSys.error('ValidationError', err.message);
	} else if (err.name === 'AppError') {
		res.status(500);
		if (req.common.env !== 'local') {
			// mattermostSys.sendErrorMsg(req.sys.errorSys, err, err.message);
		}
	} else {
		res.status(500);
		/* у нас в err что-то не то */
		req.sys.errorSys.error('server_error', 'Ошибка сервера');
		// mattermostSys.sendErrorMsg(req.sys.errorSys, err, `${String(err)}`);
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

	const arrError = req.sys.errorSys.getErrors();

	const vErrorForAPI = { // собираем ошибку
		api_key: req.sys.apikey || null,
		type: 'backend',
		env: req.common.env || null,
		user_id: req.sys.userSys.idUser || null,
		url: req.originalUrl || null,
		message: err.message || null,
		stack: err.stack || null,
		request_body: JSON.stringify(req.body) || null,
		fields: JSON.stringify(arrError),
	};

	try { // отправка ошибки в апи
		axios.post(req.common.hook_url_errors_api, vErrorForAPI);
	} catch (e) {
		console.warn(e, 'Не удалось отправить ошибку');
	}

	res.send(
		req.sys.responseSys.response(null, err.message),
	);
};
