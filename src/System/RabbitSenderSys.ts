import * as amqp from 'amqplib/callback_api';
import MainRequest from './MainRequest';


/**
 * Отправщик сообщений в очередь
 */
export class RabbitSenderSys {


    protected connection:any;
    public aQuery:{[key:string]:RabbitQueue};

    constructor(connection: any) {
        this.connection = connection;
        this.aQuery = <any>[];
    }

    /**
     * Отправить сообщение в очередь
     * @param msg
     */
    public sendToQueue(sQueue:string, msg: any) {

        this.aQuery[sQueue].sendToQueue(JSON.stringify(msg));
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
    static async Init(confConnect:string, queryList: string[]): Promise<RabbitSenderSys> {
        return new Promise((resolve, reject) => {

            try {
                /* подключаемся к серверу */
                amqp.connect(confConnect, async function (error0: any, connection: any) {
                    if (error0) {
                        throw error0;
                    }

                    let rabbitSender = new RabbitSenderSys(connection);
                    for(let kQuery in queryList){
                        let sQuery = queryList[kQuery];

                        rabbitSender.aQuery[sQuery] = await RabbitQueue.init(connection, sQuery);

                        resolve(rabbitSender);
                    }

                });

            } catch (e) {
                reject(e);
            }
        });

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

    public channel: any; // канал

    constructor(sQuery: any, conn:any, channel:any) {
        this.conn = conn;
        this.sQuery = sQuery;
        this.channel = channel;
    }



    static async init(conn:any, sQuery:any):Promise<RabbitQueue>{
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