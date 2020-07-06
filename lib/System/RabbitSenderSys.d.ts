import { Replies } from 'amqplib/callback_api';
/**
 * Отправщик сообщений в очередь
 */
export declare class RabbitSenderSys {
    protected connection: any;
    aQuery: {
        [key: string]: RabbitQueue;
    };
    constructor(connection: any);
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
}
/**
 * Очередь
 */
declare class RabbitQueue {
    sQuery: string;
    conn: any;
    sendToQueue(msg: any): void;
    checkQueue(): Promise<unknown>;
    channel: any;
    constructor(sQuery: any, conn: any, channel: any);
    static init(conn: any, sQuery: any): Promise<RabbitQueue>;
}
export {};
