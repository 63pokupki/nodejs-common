/* eslint-disable @typescript-eslint/ban-types */
import { ErrorSys } from '@a-a-game-studio/aa-components';

import { fErrorHandler } from './ErrorHandler';
import { MattermostSys } from './MattermostSys';
import { P63Context } from './P63Context';

/**
 * Функция рендера страницы
 * @param faCallback - функция контролера
 */
export const faSendRouter = (faCallback: (ctx: P63Context) => Promise<void> ) => async (ctx: P63Context): Promise<void> => {
	try {
		const vTimeOut =  setTimeout(() => {

			if (ctx.common.env === 'prod') {
				const gMattermostSys = new MattermostSys(ctx);
				gMattermostSys.sendMonitoringMsg('Мониторинг скорости запросов', `${ctx.common.nameApp} - ${ctx.url.pathname}`);

				console.log('WARNING - ОЧЕНЬ МЕДЛЕННЫЙ МЕТОД', 'url: ', ctx.url.pathname, 'body: ', ctx.body)
			}

        }, 5000) // 5 секунд

		await faCallback(ctx);

		clearTimeout(vTimeOut)
	} catch (e) {
        ctx.sys.errorSys.errorEx(e, ctx.req.url, ctx.msg);
		fErrorHandler(ctx);
	}
};

/**
 * Системный сервис формирования ответа
 */
export class ResponseSys {
	private env: string;

	private ctx: P63Context;

	private ifDevMode: boolean;

	private errorSys: ErrorSys;

	constructor(ctx: P63Context) {
		this.ctx = ctx;
		this.env = ctx.common.env;
		if (this.env === 'local' || this.env === 'dev' || this.env === 'test') {
			this.ifDevMode = true;
		} else {
			this.ifDevMode = false;
		}

		this.errorSys = ctx.sys.errorSys;

	}

	/**
	 * Формирование ответа клиенту
	 *
	 * @param array|null data
	 * @param string sMsg
	 * @return array
	 */
	public response(data: any, sMsg: string): any {
		const out: any = {
			ok: this.errorSys.isOk(),
			e: !this.errorSys.isOk(),
			errors: this.errorSys.getErrors(),
			warning: this.errorSys.getWarning(),
			notice: this.errorSys.getNotice(),
			msg: sMsg,
		};

		if (this.ifDevMode) { // Выводит информацию для разработчиков и тестировщиков
			out.dev_warning = this.errorSys.getDevWarning();
			out.dev_notice = this.errorSys.getDevNotice();
			out.dev_log = this.errorSys.getDevLog();
		}

		if (this.errorSys.isOk()) {
			out.data = data;
		} else {
			out.data = null;
			out.msg = 'Что то пошло не так - обратитесь к администратору';
		}

		return out;
	}
}
