"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitSenderSys = exports.RabbitSenderSys = void 0;
const amqp = __importStar(require("amqplib/callback_api"));
const bluebird_1 = require("bluebird");
/** Отправщик сообщений в очередь */
class RabbitSenderSys {
    constructor() {
        this.bConnectionProcess = false;
        this.connection = null;
        this.aQuery = {};
    }
    /**
     * Отправить сообщение в очередь
     * @param sQueue
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
                if (err) {
                    reject(err);
                }
                resolve(ok);
            });
        });
    }
    /** Закрыть соединение */
    close() {
        setTimeout(() => {
            this.connection.close();
        }, 1000);
    }
    /**
     * Асинхронный конструктор
     * @param confConnect
     * @param queryList
     */
    async Init(confConnect, queryList) {
        this.bConnectionProcess = false;
        return new Promise((resolve, reject) => {
            // Подключаемся к серверу
            amqp.connect(confConnect, async (error0, connection) => {
                if (error0) {
                    reject(error0);
                    throw error0;
                }
                connection.on('error', (err) => {
                    if (err.message !== 'Connection closing') {
                        console.error('[AMQP] Ошибка соединения', err.message);
                        if (!this.bConnectionProcess) {
                            console.log('Переподключение...');
                            this.bConnectionProcess = true;
                            setTimeout(this.Init, 30000, confConnect, queryList);
                        }
                    }
                });
                connection.on('close', () => {
                    console.error('[AMQP] Соединение закрыто');
                    if (!this.bConnectionProcess) {
                        console.log('Переподключение...');
                        this.bConnectionProcess = true;
                        setTimeout(this.Init, 30000, confConnect, queryList);
                    }
                });
                this.connection = connection;
                // let rabbitSenderSys = new RabbitSenderSys(connection);
                for (const kQuery in queryList) {
                    const sQuery = queryList[kQuery];
                    this.aQuery[sQuery] = await RabbitQueue.init(connection, sQuery);
                }
                // Подписываемся на отслеживание сообщений на канал для worker
                if (this.vWatchChannel) {
                    const vWatchCannel = this.vWatchChannel;
                    const vCannel = this.aQuery[vWatchCannel.queryName].channel;
                    /* флаг ожидания своей очереди */
                    vCannel.prefetch(vWatchCannel.channelCount);
                    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', vWatchCannel.queryName);
                    /* Запускаем обработчик */
                    vCannel.consume(vWatchCannel.queryName, async (msg) => {
                        await vWatchCannel.faAction(msg, vCannel);
                    }, {
                        noAck: false,
                    });
                }
                console.log('Соединение c RabbitMQ успешно установленно');
                this.bConnectionProcess = false;
                resolve(connection);
            });
        }).catch((e) => {
            console.log('Не удалось соединится c RabbitMQ');
            console.error('[AMQP]', e.message);
            if (!this.bConnectionProcess) {
                console.log('Переподключение...');
                this.bConnectionProcess = true;
                setTimeout(this.Init, 30000, confConnect, queryList);
            }
            bluebird_1.reject(e);
        });
    }
    /**
     * Подписаться на канал
     * @param queryName
     * @param channelCount
     * @param faAction
     */
    watchChannel(queryName, channelCount, faAction) {
        this.vWatchChannel = {
            queryName,
            channelCount,
            faAction,
        };
    }
    /**
     * Получить канал
     * @param queryName
     */
    getChannel(queryName) {
        let vChannel = null;
        try {
            vChannel = this.aQuery[queryName].channel;
        }
        catch (e) {
            console.log('>>>Очереди не существует');
        }
        return vChannel;
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
    /**
     *
     * @param msg
     */
    sendToQueue(msg) {
        this.channel.sendToQueue(this.sQuery, Buffer.from(msg), {
            persistent: true,
        });
    }
    /** */
    checkQueue() {
        return new Promise((resolve) => {
            this.channel.checkQueue(this.sQuery, (data) => {
                resolve(data);
            });
        });
    }
    /**
     *
     * @param conn
     * @param sQuery
     */
    static async init(conn, sQuery) {
        return new Promise((resolve, reject) => {
            try {
                /* подключаемся к каналу */
                conn.createChannel((error1, channel) => {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(sQuery, {
                        durable: false,
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