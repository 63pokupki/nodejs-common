import { P63Context } from './P63Context';
import { ErrorSys, ErrorT } from '@63pokupki/components/lib';
import { faApiRequest } from './ApiRequest';
import { tryJsonToString } from '../Helpers/Json';


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

    const sTraceError = ctx.sys.errorSys.getTraceList().map(el => el.e.stack).join('\r\n');

    let iCodeError = 500; // Коды для серверных ошибок
    let tCategoryError = CategoryErrorT.error; // Категория различие ошибки не ошибки
    if (ixErrors[ErrorT.throwLogic] || ixErrors[ErrorT.throwAccess]) { // логическая ошибка
        iCodeError = 403
        tCategoryError = CategoryErrorT.logic;
    }

    if (ixErrors[ErrorT.throwValid]) { // ошибка валидации
        iCodeError = 400;
        tCategoryError = CategoryErrorT.valid;
    }

    if (ixErrors[ErrorT.throwValidDB]) { // ошибка валидации БД
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

    ixErrors["host"] = ctx.headers["host"];
    ixErrors["x-forwarded-for"] = <string>ctx.headers["x-forwarded-for"];
    ixErrors["x-real-ip"] = <string>ctx.headers["x-real-ip"];
    ixErrors["user-agent"] = ctx.headers["user-agent"];

    if (!ixErrors['stop_execute_no_error']) {
        const aTraceError = ctx.sys.errorSys.getTraceList();
        const aTraceErrorSend: {
            key: string;
            msg: string;
            error: string;
            trace: string;
        }[] = []
        for (let i = 0; i < aTraceError.length; i++) {
            const vTraceError = aTraceError[i];
            aTraceErrorSend.push({
                key: vTraceError.key,
                msg: vTraceError.msg,
                error: vTraceError?.e?.message,
                trace: vTraceError?.e?.stack
            })
        }

        
        try { // отправка ошибки в апи

            const vErrorForAPI = { // собираем ошибку
                apikey: ctx.sys.apikey || null,
                type: 'backend',
                category: tCategoryError,
                env: ctx.common.host_public,
                user_id: ctx.sys.userSys.idUser || 0,
                url: ctx.req.url || null,
                message: ctx.msg || null,
                stack: JSON.stringify(aTraceErrorSend) || null,
                request_body: JSON.stringify(ctx.body) || null,
                fields: JSON.stringify(ixErrors),
            };

            ctx.sys.monitoringSys.sendErrorApi('api_error:' + ctx.common.nameApp+':'+ ctx.req.url, {
                time_start: Date.now(),
                time_end: Date.now(),
                val:ctx.sys.userSys.idUser,
                msg:tryJsonToString(vErrorForAPI)
            });
            // await faApiRequest<any>(ctx, ctx.common.hook_url_errors_api, vErrorForAPI);
        } catch (e) {
            console.warn('Не удалось отправить ошибку на api');
        }
    }

    ctx.send(
        JSON.stringify(ctx.sys.responseSys.response(null, 'Ошибка сервера')),
    );
};
