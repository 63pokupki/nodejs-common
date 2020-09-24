import { Connection, Replies } from 'amqplib/callback_api';
/** Отправщик сообщений в очередь */
export declare class RabbitSenderSys {
    bConnectionProcess: boolean;
    protected connection: Connection;
    aQuery: {
        [key: string]: RabbitQueue;
    };
    vWatchChannel: {
        queryName: string;
        channelCount: number;
        faAction: Function;
    };
    /**
     * Отправить сообщение в очередь
     * @param sQueue
     * @param msg
     */
    sendToQueue(sQueue: string, msg: any): void;
    /**
     * Получает данные по очереди
     * @param sQueue
     */
    checkQueue(sQueue: string): Promise<Replies.AssertQueue>;
    /** Закрыть соединение */
    close(): void;
    /**
     * Асинхронный конструктор
     * @param confConnect
     * @param queryList
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
    getChannel(queryName: string): any;
}
/**
 * Очередь
 */
declare class RabbitQueue {
    sQuery: string;
    conn: any;
    /**
     *
     * @param msg
     */
    sendToQueue(msg: any): void;
    /** */
    checkQueue(): Promise<void>;
    /** Канал */
    channel: any;
    constructor(sQuery: any, conn: any, channel: any);
    /**
     *
     * @param conn
     * @param sQuery
     */
    static init(conn: any, sQuery: any): Promise<RabbitQueue>;
}
export declare const rabbitSenderSys: RabbitSenderSys;
export {};
