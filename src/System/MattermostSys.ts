import axios from 'axios';
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';

import { MainRequest } from './MainRequest';

interface MattermostField {
	short: boolean;
	title: string;
	value: string;
}

interface MattermostMsg {
	attachments: {
		fallback: string;
		color: string;
		text: string;
		title: string;
		fields: MattermostField[];
	}[];
}

/** Класс для работы с MatterMost'ом */
export class MattermostSys {
	protected req: MainRequest;

	protected errorSys: ErrorSys;

	constructor(req: MainRequest) {
		this.req = req;
		this.errorSys = req.sys.errorSys;
	}

	/**
     * Отправить сообщение об ошибке в чат errors
     * @param errorSys
     * @param err
     * @param addMessage
     */
	public sendErrorMsg(errorSys: ErrorSys, err: Error, addMessage: string): void {
		const arrError = errorSys.getErrors();

		const msg: MattermostMsg = {
			attachments: [
				{
					fallback: 'test',
					color: 'danger',
					text: `:boom: :trollface: Apikey: ${this.req.sys.apikey}`,
					title: `Ошибка на ${this.req.conf.common.env}`,
					fields: [
						{
							short: true,
							title: 'URL',
							value: `:link: ${this.req.originalUrl}`,
						},
						{
							short: true,
							title: 'Сообщение',
							value: `:zap: ${addMessage}`,
						},
						{
							short: false,
							title: 'stack',
							value: `:bangbang: ${err.stack}`,
						},
						{
							short: false,
							title: 'request body',
							value: this.req.body,
						},
					],
				},
			],
		};

		for (const k in arrError) {
			const v = arrError[k];

			msg.attachments[0].fields.push({
				short: true,
				title: k,
				value: v,
			});
		}

		this.send(msg, this.req.conf.common.hook_url_errors);
	}

	/**
     * Отправить сообщение об ошибке в чат errors
     * @param errorSys
     * @param err
     * @param addMessage
     */
	public sendFrontErrorMsg(aError: {title: string; value: string}[], sMessage: string): void {
		const msg: MattermostMsg = {
			attachments: [
				{
					fallback: 'test',
					color: 'danger',
					text: `:boom: :trollface: ApiKey:${this.req.sys.apikey} - ID:${this.req.sys.userSys.idUser}`,
					title: `Ошибка на ${this.req.conf.common.env}`,
					fields: [
					],
				},
			],
		};

		try {
			for (let i = 0; i < aError.length; i++) {
				const v = aError[i];

				if (i < 20) { // Максимум 20 ошибок
					msg.attachments[0].fields.push({
						short: true,
						title: v.title,
						value: v.value,
					});
				}
			}
		} catch (e) {
			this.errorSys.errorEx(e, 'error_format', 'Некоректный формат ошибок с фронта');
		}

		if (this.errorSys.isOk()) {
			this.send(msg, this.req.conf.common.hook_url_front_errors);
		}
	}

	/**
     * Отправить сообщение по мониторингу RabbitMQ
     * @param sTitle - Заголово сообщения
	 * @param sMsg - Сообщение
     */
	public sendMonitoringMsg(sTitle: string, sMsg: string): void {
		const msg: MattermostMsg = {
			attachments: [
				{
					fallback: 'test',
					color: 'info',
					text: `:boom: :trollface: ${sTitle}`,
					title: `Мониторинг на ${this.req.conf.common.env}`,
					fields: [
						{
							short: true,
							title: sTitle,
							value: sMsg,
						},
					],
				},
			],
		};

		this.send(msg, this.req.conf.common.hook_url_monitoring);
	}

	/**
     * общий метод для отправки сообщения
     * @param msg
     * @param hook_url
     */
	public send(msg: MattermostMsg, hook_url: string): void {
		axios.post(hook_url, msg);
	}
}
