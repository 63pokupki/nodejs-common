"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib/callback_api");
/**
 * Отправщик сообщений в очередь
 */
class RabbitSenderSys {
    constructor(connection) {
        this.connection = connection;
        this.aQuery = [];
    }
    /**
     * Отправить сообщение в очередь
     * @param msg
     */
    sendToQueue(sQueue, msg) {
        this.aQuery[sQueue].sendToQueue(JSON.stringify(msg));
    }
    /**
     * Закрыть соединение
     */
    close() {
        setTimeout(() => {
            this.connection.close();
        }, 1000);
    }
    /**
     * Асинхронный конструктор
     * @param query
     */
    static async Init(confConnect, queryList) {
        return new Promise((resolve, reject) => {
            try {
                /* подключаемся к серверу */
                amqp.connect(confConnect, async function (error0, connection) {
                    if (error0) {
                        throw error0;
                    }
                    let rabbitSender = new RabbitSenderSys(connection);
                    for (let kQuery in queryList) {
                        let sQuery = queryList[kQuery];
                        rabbitSender.aQuery[sQuery] = await RabbitQueue.init(connection, sQuery);
                        resolve(rabbitSender);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.RabbitSenderSys = RabbitSenderSys;
/**
 * Очередь
 */
class RabbitQueue {
    sendToQueue(msg) {
        // console.log(this.sQuery, Buffer.from(msg));
        this.channel.sendToQueue(this.sQuery, Buffer.from(msg), {
            persistent: true
        });
    }
    constructor(sQuery, conn, channel) {
        this.conn = conn;
        this.sQuery = sQuery;
        this.channel = channel;
    }
    static async init(conn, sQuery) {
        return new Promise((resolve, reject) => {
            try {
                /* подключаемся к каналу */
                conn.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(sQuery, {
                        durable: false
                    });
                    /* отдаем новый экземпляр класса */
                    resolve(new RabbitQueue(sQuery, conn, channel));
                });
            }
            catch (e) {
                reject(e);
            }
        });
        // return vQuery;
    }
}
//# sourceMappingURL=RabbitSenderSys.js.map