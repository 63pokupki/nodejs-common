import * as amqp from 'amqplib/callback_api';
import { reject } from 'bluebird';
import { Replies } from 'amqplib/callback_api';

import { MainRequest } from './MainRequest';

/**
 * Отправщик сообщений в очередь
 */
export class RabbitSenderSys {
	public bConnectionProcess = false;

	protected connection: any;

	public aQuery: { [key: string]: RabbitQueue };

	public vWatchChannel: {queryName: string; channelCount: number; faAction: Function};

	constructor() {
		this.connection = null;
		this.aQuery = <any>[];
	}

	/**
     * Отправить сообщение в очередь
     * @param msg
     */
	public sendToQueue(sQueue: string, msg: any): void {
		this.aQuery[sQueue].sendToQueue(JSON.stringify(msg));
	}

	/**
     * Получает данные по очереди
     * @param sQueue
     */
	public checkQueue(sQueue: string): Promise<Replies.AssertQueue> {
		return new Promise((resolve, reject) => {
			this.aQuery[sQueue].channel.checkQueue(sQueue, (err: any, ok: Replies.AssertQueue) => {
				if (err) reject(err);
				resolve(ok);
			});
		});
	}

	/**
     * Закрыть соединение
     */
	public close(): void {
		setTimeout(() => {
			this.connection.close();
		}, 1000);
	}

	/**
     * Асинхронный конструктор
     * @param query
     */
	public async Init(confConnect: string, queryList: string[]): Promise<any> {
		rabbitSenderSys.bConnectionProcess = false;
		return new Promise((resolve, reject) => {
			/* подключаемся к серверу */
			amqp.connect(confConnect, async (error0: any, connection: any) => {
				if (error0) {
					reject(error0);
					throw error0;
				}

				connection.on('error', (err: any) => {
					if (err.message !== 'Connection closing') {
						console.error('[AMQP] Ошибка соединения', err.message);

						if (!rabbitSenderSys.bConnectionProcess) {
							console.log('Переподключение...');
							rabbitSenderSys.bConnectionProcess = true;
							return setTimeout(rabbitSenderSys.Init, 30000, confConnect, queryList);
						}
					}
				});
				connection.on('close', () => {
					console.error('[AMQP] Соединение закрыто');
					if (!rabbitSenderSys.bConnectionProcess) {
						console.log('Переподключение...');
						rabbitSenderSys.bConnectionProcess = true;
						return setTimeout(rabbitSenderSys.Init, 30000, confConnect, queryList);
					}
				});

				rabbitSenderSys.connection = connection;

				// let rabbitSenderSys = new RabbitSenderSys(connection);
				for (const kQuery in queryList) {
					const sQuery = queryList[kQuery];

					rabbitSenderSys.aQuery[sQuery] = await RabbitQueue.init(connection, sQuery);
				}

				// Подписываемся на отслеживание сообщений на канал для worker
				if (rabbitSenderSys.vWatchChannel) {
					const vWatchCannel = rabbitSenderSys.vWatchChannel;
					const vCannel = rabbitSenderSys.aQuery[vWatchCannel.queryName].channel;

					/* флаг ожидания своей очереди */
					vCannel.prefetch(vWatchCannel.channelCount);
					console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', vWatchCannel.queryName);
					/* Запускаем обработчик */
					vCannel.consume(vWatchCannel.queryName, async (msg: any) => {
						await vWatchCannel.faAction(msg, vCannel);
					}, {
						noAck: false,
					});
				}

				console.log('Соединение c RabbitMQ успешно установленно');
				rabbitSenderSys.bConnectionProcess = false;

				resolve(connection);
			});
		}).catch((e) => {
			console.log('Не удалось соединится c RabbitMQ');
			console.error('[AMQP]', e.message);
			if (!rabbitSenderSys.bConnectionProcess) {
				console.log('Переподключение...');
				rabbitSenderSys.bConnectionProcess = true;
				setTimeout(rabbitSenderSys.Init, 30000, confConnect, queryList);
			}
			reject(e);
		});
	}

	/**
	 * Подписаться на канал
	 * @param queryName
	 * @param channelCount
	 * @param faAction
	 */
	public watchChannel(queryName: string, channelCount: number, faAction: Function): void {
		rabbitSenderSys.vWatchChannel = {
			queryName,
			channelCount,
			faAction,
		};
	}

	/**
	 * Получить канал
	 * @param queryName
	 */
	public getChannel(queryName: string): void {
		let vChannel = null;
		try {
			vChannel = rabbitSenderSys.aQuery[queryName].channel;
		} catch (e) {
			console.log('>>>Очереди не существует');
		}

		return vChannel;
	}
}

/**
 * Очередь
 */
class RabbitQueue {
	public sQuery: string; // имя очереди

	public conn: any; // соединение

	public sendToQueue(msg: any): void {
		// console.log(this.sQuery, Buffer.from(msg));
		this.channel.sendToQueue(this.sQuery, Buffer.from(msg), {
			persistent: true,
		});
	}

	public checkQueue(): Promise<void> {
		return new Promise((resolve) => {
			// console.log(this.sQuery, Buffer.from(msg));
			this.channel.checkQueue(this.sQuery, (data: any) => {
				resolve(data);
			});
		});
	}

	public channel: any; // канал

	constructor(sQuery: any, conn: any, channel: any) {
		this.conn = conn;
		this.sQuery = sQuery;
		this.channel = channel;
	}

	static async init(conn: any, sQuery: any): Promise<RabbitQueue> {
		return new Promise((resolve, reject) => {
			try {
				/* подключаемся к каналу */
				conn.createChannel((error1: any, channel: any) => {
					if (error1) {
						throw error1;
					}

					channel.assertQueue(sQuery, {
						durable: false,
					});

					/* отдаем новый экземпляр класса */

					resolve(new RabbitQueue(sQuery, conn, channel));
				});
			} catch (e) {
				reject(e);
			}
		});

		// return vQuery;
	}
}

export const rabbitSenderSys: RabbitSenderSys = new RabbitSenderSys();
