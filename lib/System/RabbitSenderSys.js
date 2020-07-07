"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib/callback_api");
const bluebird_1 = require("bluebird");
/**
 * Отправщик сообщений в очередь
 */
class RabbitSenderSys {
    constructor() {
        this.bConnectionProcess = false;
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
        exports.rabbitSenderSys.bConnectionProcess = false;
        return new Promise((resolve, reject) => {
            /* подключаемся к серверу */
            amqp.connect(confConnect, async function (error0, connection) {
                if (error0) {
                    reject(error0);
                    throw error0;
                }
                connection.on("error", function (err) {
                    if (err.message !== "Connection closing") {
                        console.error("[AMQP] Ошибка соединения", err.message);
                        if (!exports.rabbitSenderSys.bConnectionProcess) {
                            console.log('Переподключение...');
                            exports.rabbitSenderSys.bConnectionProcess = true;
                            return setTimeout(exports.rabbitSenderSys.Init, 30000, confConnect, queryList);
                        }
                    }
                });
                connection.on("close", function () {
                    console.error("[AMQP] Соединение закрыто");
                    if (!exports.rabbitSenderSys.bConnectionProcess) {
                        console.log('Переподключение...');
                        exports.rabbitSenderSys.bConnectionProcess = true;
                        return setTimeout(exports.rabbitSenderSys.Init, 30000, confConnect, queryList);
                    }
                });
                exports.rabbitSenderSys.connection = connection;
                // let rabbitSenderSys = new RabbitSenderSys(connection);
                for (let kQuery in queryList) {
                    let sQuery = queryList[kQuery];
                    exports.rabbitSenderSys.aQuery[sQuery] = await RabbitQueue.init(connection, sQuery);
                }
                console.log('Соединение c RabbitMQ успешно установленно');
                exports.rabbitSenderSys.bConnectionProcess = false;
                resolve(connection);
            });
        }).catch((e) => {
            console.log('Не удалось соединится c RabbitMQ');
            console.error("[AMQP]", e.message);
            if (!exports.rabbitSenderSys.bConnectionProcess) {
                console.log('Переподключение...');
                exports.rabbitSenderSys.bConnectionProcess = true;
                setTimeout(exports.rabbitSenderSys.Init, 30000, confConnect, queryList);
            }
            bluebird_1.reject(e);
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
exports.rabbitSenderSys = new RabbitSenderSys();
//# sourceMappingURL=RabbitSenderSys.js.map