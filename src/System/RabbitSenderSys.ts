import * as amqp from 'amqplib/callback_api';
import { MainRequest } from './MainRequest';
import { resolve, reject } from 'bluebird';
import { Replies } from 'amqplib/callback_api';


/**
 * Отправщик сообщений в очередь
 */
export class RabbitSenderSys {

	public bConnectionProcess = false;
    protected connection: any;
	public aQuery: { [key: string]: RabbitQueue };

	public vWatchCannel:{queryName:string,chanelCount:number, faAction:Function};

    constructor() {
        this.connection = null;
        this.aQuery = <any>[];
    }

    /**
     * Отправить сообщение в очередь
     * @param msg
     */
    public sendToQueue(sQueue: string, msg: any) {

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
    public close() {
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
			amqp.connect(confConnect, async function (error0: any, connection: any) {
				if (error0) {
					reject(error0);
					throw error0;
				}

				connection.on("error", function(err:any) {
					if (err.message !== "Connection closing") {
						console.error("[AMQP] Ошибка соединения", err.message);

						if(!rabbitSenderSys.bConnectionProcess){
							console.log('Переподключение...');
							rabbitSenderSys.bConnectionProcess = true;
							return  setTimeout(rabbitSenderSys.Init, 30000, confConnect, queryList);
						}

					}
				});
				connection.on("close", function() {
					console.error("[AMQP] Соединение закрыто");
					if(!rabbitSenderSys.bConnectionProcess){
						console.log('Переподключение...');
						rabbitSenderSys.bConnectionProcess = true;
						return setTimeout(rabbitSenderSys.Init, 30000, confConnect, queryList);
					}
				});

				rabbitSenderSys.connection = connection;

				// let rabbitSenderSys = new RabbitSenderSys(connection);
				for (let kQuery in queryList) {
					let sQuery = queryList[kQuery];

					rabbitSenderSys.aQuery[sQuery] = await RabbitQueue.init(connection, sQuery);

				}

				// Подписываемся на отслеживание сообщений на канал для worker
				if(rabbitSenderSys.vWatchCannel){
					const vWatchCannel = rabbitSenderSys.vWatchCannel;
					let vCannel = rabbitSenderSys.aQuery[vWatchCannel.queryName].channel;

					/* флаг ожидания своей очереди */
					vCannel.prefetch(vWatchCannel.chanelCount);
					console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', vWatchCannel.queryName);
					/* Запускаем обработчик */
					vCannel.consume(vWatchCannel.queryName, async (msg: any) => {
						await vWatchCannel.faAction(msg, vCannel);
					}, {
						noAck: false
					});
				}

				console.log('Соединение c RabbitMQ успешно установленно');
				rabbitSenderSys.bConnectionProcess = false;

				resolve(connection);

			});

		}).catch((e) =>{
			console.log('Не удалось соединится c RabbitMQ');
			console.error("[AMQP]", e.message);
			if(!rabbitSenderSys.bConnectionProcess){
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
	 * @param chanelCount
	 * @param faAction
	 */
	public watchCannel(queryName:string,chanelCount:number, faAction:Function){

		rabbitSenderSys.vWatchCannel = {
			queryName:queryName,
			chanelCount:chanelCount,
			faAction:faAction
		};
	}

	/**
	 * Получить канал
	 * @param queryName
	 */
	public getChannel(queryName:string){

		let vChannel = null;
		try{
			vChannel = rabbitSenderSys.aQuery[queryName].channel;
		} catch(e){
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

    public sendToQueue(msg: any) {
        // console.log(this.sQuery, Buffer.from(msg));
        this.channel.sendToQueue(this.sQuery, Buffer.from(msg), {
            persistent: true
        });
    }

    public checkQueue() {
        return new Promise((resolve, reject) => {
            // console.log(this.sQuery, Buffer.from(msg));
            this.channel.checkQueue(this.sQuery, (data: any) => {
                resolve(data);
            });
        })

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
                conn.createChannel(function (error1: any, channel: any) {
                    if (error1) {
                        throw error1;
                    }

                    channel.assertQueue(sQuery, {
                        durable: false
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