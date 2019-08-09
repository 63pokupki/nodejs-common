"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib/callback_api");
class RabbitSender {
    constructor(connection) {
        this.connection = connection;
        this.aQuery = [];
    }
    sendToQueue(sQueue, msg) {
        this.aQuery[sQueue].sendToQueue(JSON.stringify(msg));
    }
    close() {
        setTimeout(() => {
            this.connection.close();
        }, 1000);
    }
    static async Init(confConnect, queryList) {
        return new Promise((resolve, reject) => {
            try {
                amqp.connect(confConnect, async function (error0, connection) {
                    if (error0) {
                        throw error0;
                    }
                    let rabbitSender = new RabbitSender(connection);
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
exports.RabbitSender = RabbitSender;
class RabbitQueue {
    sendToQueue(msg) {
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
                conn.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(sQuery, {
                        durable: false
                    });
                    resolve(new RabbitQueue(sQuery, conn, channel));
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
//# sourceMappingURL=RabbitSenderSys.js.map