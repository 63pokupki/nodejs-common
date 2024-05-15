import axios from 'axios';
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { P63Context } from './P63Context';

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
	protected ctx: P63Context;

	protected errorSys: ErrorSys;

	constructor(ctx: P63Context) {
		this.ctx = ctx;
		this.errorSys = ctx.sys.errorSys;
	}

    /**
     * общий метод для отправки сообщения
     * @param msg
     * @param hook_url
     */
	public send(sUrl: string, msg: MattermostMsg): void {
		axios.post(sUrl, msg);
	}

    /**
     * Отправить сообщение по мониторингу RabbitMQ
     * @param sTitle - Заголово сообщения
	 * @param sMsg - Сообщение
     */
	public sendMsg(sUrl:string, sTitle: string, sMsg: string): void {
		const msg: MattermostMsg = {
			attachments: [
				{
					fallback: 'test',
					color: 'info',
					text: `:boom: :trollface: ${sTitle}`,
					title: `Мониторинг на ${this.ctx.common.env}`,
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

		this.send(sUrl, msg);
	}

	/**
     * Отправить сообщение об ошибке в чат errors
     * @param errorSys
     * @param err
     * @param addMessage
     */
	public sendMsgList(sUrl:string, aMsgList: {title: string; value: string}[]): void {
		const msg: MattermostMsg = {
			attachments: [
				{
					fallback: 'test',
					color: 'danger',
					text: `:boom: :trollface: ApiKey:${this.ctx.sys.apikey} - ID:${this.ctx.sys.userSys.idUser}`,
					title: `Ошибка на ${this.ctx.common.env}`,
					fields: [
					],
				},
			],
		};

		try {
			for (let i = 0; i < aMsgList.length; i++) {
				const v = aMsgList[i];

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
			this.send(sUrl, msg);
		}
	}
}
