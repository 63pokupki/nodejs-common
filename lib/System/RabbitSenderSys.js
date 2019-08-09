"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib/callback_api");
class RabbitSender {
    constructor(connection) {
        this.connection = connection;
        this.aQuery = [];
    }
    sendToQueue(sQueue, msg) {
        this.aQuery[sQueue].sendToQueue(Buffer.from(msg));
    }
    close() {
        setTimeout(() => {
            this.connection.close();
        }, 1000);
    }
    static Init(confConnect, queryList) {
        return new Promise((resolve, reject) => {
            try {
                amqp.connect(confConnect, function (error0, connection) {
                    if (error0) {
                        throw error0;
                    }
                    let rabbitSender = new RabbitSender(connection);
                    for (let kQuery in queryList) {
                        let sQuery = queryList[kQuery];
                        rabbitSender.aQuery[sQuery] = RabbitQueue.init(connection, sQuery);
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
    constructor(sQuery, conn, channel) {
        this.conn = conn;
        this.sQuery = sQuery;
        this.channel = channel;
    }
    static init(conn, sQuery) {
        let vQuery = null;
        conn.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(sQuery, {
                durable: false
            });
            vQuery = new RabbitQueue(sQuery, conn, channel);
        });
        return vQuery;
    }
    sendToQueue(msg) {
        this.channel.sendToQueue(this.sQuery, Buffer.from(msg), {
            persistent: true
        });
    }
}
//# sourceMappingURL=RabbitSenderSys.js.map