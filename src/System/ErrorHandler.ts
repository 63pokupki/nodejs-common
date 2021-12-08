
import axios from 'axios';
import { P63Context } from './P63Context';
import { ErrorSys, ErrorT } from '@a-a-game-studio/aa-components/lib';

/**
 * Обработчик ошибок выполнения
 * @param err - обязательно instanceof Error()
 * @param ctx
 * @param next
 */
export const fErrorHandler = async (ctx: P63Context): Promise<void> => {
	// const mattermostSys = new Mattermost.MattermostSys(<any>ctx);

	let ifDevMode = false;
    if (ctx.common.env === 'dev' || ctx.common.env === 'test' || ctx.common.env == 'local') {
        ifDevMode = true;
    }

    const ixErrors = ctx.sys.errorSys.getErrors();

    const sTraceError = ctx.sys.errorSys.getTraceList().map( el => el.e.stack).join('\n');

    if(ixErrors[ErrorT.throwLogic] || ixErrors[ErrorT.throwAccess]){ // логическая ошибка
        ctx.status(403);
    }

    if(ixErrors[ErrorT.throwValid]){ // логическая ошибка
        ctx.status(400);

    }

    if (ifDevMode) {
        console.log(
            '=================================== \r\n',
            new Date(),
            '\r\n',
            'err.msg: ',
            ctx.sys.errorSys.getErrors(),
            '\r\n',
            'err.stack: \r\n ',
            '----------------------------------- \r\n',
            sTraceError,
            '\r\n',
            '----------------------------------- \r\n',
            'originalUrl:',
            ctx.req.url,
            '\r\n',
            '=================================== \r\n',
            '\r\n',
        );
    }

	const arrError = ctx.sys.errorSys.getErrors();

	const vErrorForAPI = { // собираем ошибку
		api_key: ctx.sys.apikey || null,
		type: 'backend',
		env: ctx.common.env || null,
		user_id: ctx.sys.userSys.idUser || null,
		url: ctx.req.url || null,
		message: ctx.msg || null,
		stack: sTraceError || null,
		request_body: JSON.stringify(ctx.body) || null,
		fields: JSON.stringify(arrError),
	};

	try { // отправка ошибки в апи
		await axios.post(ctx.common.hook_url_errors_api, vErrorForAPI);
	} catch (e) {
		console.warn('Не удалось отправить ошибку на api', ctx.common.hook_url_errors_api);
	}

	ctx.send(
		JSON.stringify(ctx.sys.responseSys.response(null, 'Ошибка сервера')),
	);
};