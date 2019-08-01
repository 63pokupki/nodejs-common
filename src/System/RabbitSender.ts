import * as amqp from 'amqplib/callback_api';
import MainRequest from './MainRequest';


/**
 * Отправщик сообщений в очередь
 */
export class RabbitSender {

    private query: string; // имя очереди
    private connection: any; // соединение
    private channel: any; // канал

    constructor(query: string, connection: any, channel: any) {
        this.query = query;
        this.connection = connection;
        this.channel = channel;
    }

    /**
     * Отправить сообщение в очередь
     * @param msg 
     */
    public sendToQueue(msg: any) {
        this.channel.sendToQueue(this.query, Buffer.from(msg), {
            persistent: true
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
    static Init(req: MainRequest, query: string): Promise<RabbitSender> {
        return new Promise((resolve, reject) => {

            try {
                /* подключаемся к серверу */
                amqp.connect(req.conf.rabbit.connection, function (error0: any, connection: any) {
                    if (error0) {
                        throw error0;
                    }

                    /* подключаемся к каналу */
                    connection.createChannel(function (error1: any, channel: any) {
                        if (error1) {
                            throw error1;
                        }

                        channel.assertQueue(query, {
                            durable: false
                        });

                        /* отдаем новый экземпляр класса */
                        resolve(new RabbitSender(query, connection, channel));
                    });

                });

            } catch (e) {
                reject(e);
            }
        });

    }


}