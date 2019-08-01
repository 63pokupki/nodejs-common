"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib/callback_api");
class RabbitSender {
    constructor(query, connection, channel) {
        this.query = query;
        this.connection = connection;
        this.channel = channel;
    }
    sendToQueue(msg) {
        this.channel.sendToQueue(this.query, Buffer.from(msg), {
            persistent: true
        });
    }
    close() {
        setTimeout(() => {
            this.connection.close();
        }, 1000);
    }
    static Init(req, query) {
        return new Promise((resolve, reject) => {
            try {
                amqp.connect(req.conf.rabbit.connection, function (error0, connection) {
                    if (error0) {
                        throw error0;
                    }
                    connection.createChannel(function (error1, channel) {
                        if (error1) {
                            throw error1;
                        }
                        channel.assertQueue(query, {
                            durable: false
                        });
                        resolve(new RabbitSender(query, connection, channel));
                    });
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.RabbitSender = RabbitSender;
//# sourceMappingURL=RabbitSender.js.map