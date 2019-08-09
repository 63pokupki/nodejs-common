import * as amqp from 'amqplib/callback_api';
import MainRequest from './MainRequest';

/**
 * Отправщик сообщений в очередь
 */
export class RabbitSender {


    protected connection:any;
    protected aQuery:{[key:string]:RabbitQueue};

    constructor(connection: any) {
        this.connection = connection;
    }

    /**
     * Отправить сообщение в очередь
     * @param msg
     */
    public sendToQueue(sQueue:string, msg: any) {
        this.aQuery[sQueue].sendToQueue(Buffer.from(msg));
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
    static Init(confConnect:string, queryList: string[]): Promise<RabbitSender> {
        return new Promise((resolve, reject) => {

            try {
                /* подключаемся к серверу */
                amqp.connect(confConnect, function (error0: any, connection: any) {
                    if (error0) {
                        throw error0;
                    }

                    let rabbitSender = new RabbitSender(connection);
                    for(let kQuery in queryList){
                        let sQuery = queryList[kQuery];

                        rabbitSender.aQuery[sQuery] = RabbitQueue.init(connection, sQuery);

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
    public channel: any; // канал

    constructor(sQuery: any, conn:any, channel:any) {
        this.conn = conn;
        this.sQuery = sQuery;
        this.channel = channel;
    }

    static init(conn:any, sQuery:any):RabbitQueue{
        let vQuery = null;

        /* подключаемся к каналу */
        conn.createChannel(function (error1: any, channel: any) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(sQuery, {
                durable: false
            });

            /* отдаем новый экземпляр класса */
            vQuery = new RabbitQueue(sQuery, conn, channel);
        });

        return vQuery;
    }

    public sendToQueue(msg: any) {
        this.channel.sendToQueue(this.sQuery, Buffer.from(msg), {
            persistent: true
        });
    }


}