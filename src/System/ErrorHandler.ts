

import { P63Context } from './P63Context';
import { ErrorSys, ErrorT } from '@a-a-game-studio/aa-components/lib';
import { axiosConnect } from './AxiosConnect';



enum CategoryErrorT {
    error = 'error',
    logic = 'logic',
    valid = 'valid',
    notice = 'notice'
}
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

    const sTraceError = ctx.sys.errorSys.getTraceList().map( el => el.e.stack).join('\r\n');

    let iCodeError = 500; // Коды для серверных ошибок
    let tCategoryError = CategoryErrorT.error; // Категория различие ошибки не ошибки
    if(ixErrors[ErrorT.throwLogic] || ixErrors[ErrorT.throwAccess]){ // логическая ошибка
        iCodeError = 403
        tCategoryError = CategoryErrorT.logic;
    }

    if(ixErrors[ErrorT.throwValid]){ // ошибка валидации
        iCodeError = 400;
        tCategoryError = CategoryErrorT.valid;
    }

    if(ixErrors[ErrorT.throwValidDB]){ // ошибка валидации БД
        iCodeError = 500;
        tCategoryError = CategoryErrorT.error;
    }

    ctx.status(iCodeError);

    if (ifDevMode) {
        console.log(
            '=================================== \r\n',
            new Date(),
            'url:',
            ctx.req.url,
            '\r\n',
            '----------------------------------- \r\n',
            '\r\n',
            'err.msg: ',
            ctx.sys.errorSys.getErrors(),
            '\r\n',
            'err.stack: \r\n ',
            '----------------------------------- \r\n',
            sTraceError,
            '\r\n',
            '----------------------------------- \r\n',
            '=================================== \r\n',
            '\r\n',
        );
    }

	const arrError = ctx.sys.errorSys.getErrors();
    const aTraceError = ctx.sys.errorSys.getTraceList();
    const aTraceErrorSend:{
        key:string;
        msg:string;
        error:string;
        trace:string;
    }[] = []
    for (let i = 0; i < aTraceError.length; i++) {
        const vTraceError = aTraceError[i];
        aTraceErrorSend.push({
            key:vTraceError.key,
            msg:vTraceError.msg,
            error:vTraceError?.e?.message,
            trace:vTraceError?.e?.stack
        })
    }

	const vErrorForAPI = { // собираем ошибку
		api_key: ctx.sys.apikey || null,
		type: 'backend',
        category:tCategoryError,
		env: ifDevMode ? 'dev' : 'prod',
		user_id: ctx.sys.userSys.idUser || null,
		url: ctx.req.url || null,
		message: ctx.msg || null,
		stack: JSON.stringify(aTraceErrorSend) || null,
		request_body: JSON.stringify(ctx.body) || null,
		fields: JSON.stringify(arrError),
	};
    
	try { // отправка ошибки в апи
		await axiosConnect.post(ctx.common.hook_url_errors_api, vErrorForAPI);
	} catch (e) {
		console.warn('Не удалось отправить ошибку на api', ctx.common.hook_url_errors_api);
	}

	ctx.send(
		JSON.stringify(ctx.sys.responseSys.response(null, 'Ошибка сервера')),
	);
};