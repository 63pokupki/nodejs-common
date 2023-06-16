/* eslint-disable @typescript-eslint/ban-types */
import { ErrorSys } from '@a-a-game-studio/aa-components';

import { fErrorHandler } from './ErrorHandler';
import { MattermostSys } from './MattermostSys';
import { P63Context } from './P63Context';

let i = 0;

/** Индексированный список полезных нагрузок для функций рендера страниц */
const ixSendRouter:Record<number, {
    nameApp:string;
    pathname:string;
    body:string;
    time:number;
}> = {};

/** Интервал для очистки индексированного списка если остались не удаленные полезные нагрузки по истечения 5 секунд
 * Интервал вызывается раз в час
 */
const iInterval = setInterval(() =>{
    const aidKeys = Object.keys(ixSendRouter);
	for(let i = 0; i < aidKeys.length; i++) {
		const idKeys = Number(aidKeys[i]);
		const vCurrentSend = ixSendRouter[idKeys];
		if (vCurrentSend && new Date().getTime() - vCurrentSend.time > 60000) {
			console.log('WARNING - У НАС ЕСТЬ ЗАВИСШИЙ ЗАПРОС', 'url: ', ixSendRouter[idKeys].pathname, 'body: ', ixSendRouter[idKeys].body)
			delete ixSendRouter[idKeys];
		}
	}
}, 3600000);

/** Функция отправки сообщения в маттермост */
const fSendMonitoringMsg = (idx: number, ctx: P63Context): void => {
	if(ixSendRouter[idx] && new Date().getTime() - ixSendRouter[idx].time > 5000 && ctx.common.env === 'prod'){
		const gMattermostSys = new MattermostSys(ctx);
		gMattermostSys.sendMonitoringMsg('Мониторинг скорости запросов', `${ctx.common.nameApp} - ${ctx.url.pathname} 
		time: - начало запроса ${new Date(ixSendRouter[idx].time).toString()} - окончание запроса ${new Date().toString()}
		body: - ${JSON.stringify(ctx.body)}`);

		console.log('WARNING - ОЧЕНЬ МЕДЛЕННЫЙ МЕТОД', 'url: ', ctx.url.pathname, 'body: ', ctx.body)
	}
}

/**
 * Функция рендера страницы
 * @param faCallback - функция контролера
 */
export const faSendRouter = (faCallback: (ctx: P63Context) => Promise<void> ) => async (ctx: P63Context): Promise<void> => {
	i++;
    const currentIdx = i
    ixSendRouter[currentIdx] = {
        nameApp:ctx.common.nameApp,
        pathname:ctx.url.pathname,
        body:JSON.stringify(ctx.body),
        time:new Date().getTime()
    }

	try {

		await faCallback(ctx);

		fSendMonitoringMsg(currentIdx, ctx);

        delete ixSendRouter[currentIdx];

	} catch (e) {
		fSendMonitoringMsg(currentIdx, ctx);

        delete ixSendRouter[currentIdx];
		if (ctx.sys.errorSys.isOk()) {
			ctx.sys.errorSys.error('stop_execute_no_error', e.message);
		} else {
			ctx.sys.errorSys.errorEx(e, ctx.req.url, ctx.msg);
		}
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
