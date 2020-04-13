
import {ErrorSys} from '@a-a-game-studio/aa-components/lib';
import { MainRequest } from './MainRequest';
import { MattermostSys } from './MattermostSys';
import express = require('express');
import { fErrorHandler } from './ErrorHandler';

/**
 * Функция рендера страницы
 * @param faCallback - функция контролера
 */
export const faSendRouter = (faCallback: Function) => {
	return async (req: MainRequest, res: express.Response, next: any) => {
		try {
			await faCallback(req, res);
		} catch (e) {
			fErrorHandler(e, req, res, next);
		}
	};
};

/**
 * Системный сервис формирования ответа
 */
export class ResponseSys
{
	private env:string;
	private req:MainRequest;
	private ifDevMode:boolean;

	private errorSys:ErrorSys;
	//private mattermostSys:MattermostSys;

	constructor(req:MainRequest){

		this.req = req;
		this.env = req.conf.common.env;
		if( this.env == 'local' || this.env == 'dev' || this.env == 'test' ){
			this.ifDevMode = true;
		} else {
			this.ifDevMode = false;
		}

		this.errorSys = req.sys.errorSys;

		/* this.mattermostSys = new MattermostSys(req);
 */
	}

	/**
	 * Формирование ответа клиенту
	 *
	 * @param array|null data
	 * @param string sMsg
	 * @return array
	 */
	public response(data:any, sMsg:string): any{



		let out:any = {
			'ok' : this.errorSys.isOk(),
			'e' : !this.errorSys.isOk(),
			'errors' : this.errorSys.getErrors(),
			// 'warning' : this.errorSys.getWarning(), // Временно убраны пользовательские предупреждения
			// 'notice' : this.errorSys.getNotice(), // Временно убраны пользовательские предупреждения
			'msg' : sMsg,
		};

	/* 	// Отправка ошибок в матермост
		if( !this.errorSys.isOk() ){
			this.mattermostSys.sendMsg();
		} */

		if( this.ifDevMode ){ // Выводит информацию для разработчиков и тестировщиков
			out['dev_warning'] = this.errorSys.getDevWarning();
			out['dev_notice'] = this.errorSys.getDevNotice();
			out['dev_log'] = this.errorSys.getDevLog();
		}

		if( this.errorSys.isOk() ){
			out['data'] = data;
		} else {
			out['data'] = null;
			out['msg'] = 'Что то пошло не так - обратитесь к администратору';
		}

		return out;
	}
}
