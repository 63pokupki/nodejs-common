"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib/callback_api");
/**
 * Отправщик сообщений в очередь
 */
class RabbitSenderSys {
    constructor() {
        this.connection = null;
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
     * Получает данные по очереди
     * @param sQueue
     */
    checkQueue(sQueue) {
        return new Promise((resolve, reject) => {
            this.aQuery[sQueue].channel.checkQueue(sQueue, (err, ok) => {
                if (err)
                    reject(err);
                resolve(ok);
            });
        });
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
    async Init(confConnect, queryList) {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                /* подключаемся к серверу */
                amqp.connect(confConnect, async function (error0, connection) {
                    if (error0) {
                        throw error0;
                    }
                    connection.on("error", function (err) {
                        if (err.message !== "Connection closing") {
                            console.error("[AMQP] Ошибка соединения, переподключение...", err.message);
                            return setTimeout(this.Init, 30000, confConnect, queryList);
                        }
                    });
                    connection.on("close", function () {
                        console.error("[AMQP] переподключение");
                        return setTimeout(this.Init, 30000, confConnect, queryList);
                    });
                    self.connection = connection;
                    // let rabbitSender = new RabbitSenderSys(connection);
                    for (let kQuery in queryList) {
                        let sQuery = queryList[kQuery];
                        self.aQuery[sQuery] = await RabbitQueue.init(connection, sQuery);
                        resolve(connection);
                    }
                });
            }
            catch (e) {
                console.error("[AMQP]", e.message);
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
    constructor(sQuery, conn, channel) {
        this.conn = conn;
        this.sQuery = sQuery;
        this.channel = channel;
    }
    sendToQueue(msg) {
        // console.log(this.sQuery, Buffer.from(msg));
        this.channel.sendToQueue(this.sQuery, Buffer.from(msg), {
            persistent: true
        });
    }
    checkQueue() {
        return new Promise((resolve, reject) => {
            // console.log(this.sQuery, Buffer.from(msg));
            this.channel.checkQueue(this.sQuery, (data) => {
                resolve(data);
            });
        });
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