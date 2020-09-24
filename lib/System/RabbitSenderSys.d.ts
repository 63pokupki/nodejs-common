import { Replies } from 'amqplib/callback_api';
/**
 * Отправщик сообщений в очередь
 */
export declare class RabbitSenderSys {
    bConnectionProcess: boolean;
    protected connection: any;
    aQuery: {
        [key: string]: RabbitQueue;
    };
    vWatchChannel: {
        queryName: string;
        channelCount: number;
        faAction: Function;
    };
    constructor();
    /**
     * Отправить сообщение в очередь
     * @param msg
     */
    sendToQueue(sQueue: string, msg: any): void;
    /**
     * Получает данные по очереди
     * @param sQueue
     */
    checkQueue(sQueue: string): Promise<Replies.AssertQueue>;
    /**
     * Закрыть соединение
     */
    close(): void;
    /**
     * Асинхронный конструктор
     * @param query
     */
    Init(confConnect: string, queryList: string[]): Promise<any>;
    /**
     * Подписаться на канал
     * @param queryName
     * @param channelCount
     * @param faAction
     */
    watchChannel(queryName: string, channelCount: number, faAction: Function): void;
    /**
     * Получить канал
     * @param queryName
     */
    getChannel(queryName: string): void;
}
/**
 * Очередь
 */
declare class RabbitQueue {
    sQuery: string;
    conn: any;
    sendToQueue(msg: any): void;
    checkQueue(): Promise<void>;
    channel: any;
    constructor(sQuery: any, conn: any, channel: any);
    static init(conn: any, sQuery: any): Promise<RabbitQueue>;
}
export declare const rabbitSenderSys: RabbitSenderSys;
export {};
