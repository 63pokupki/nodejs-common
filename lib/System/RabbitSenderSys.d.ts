import MainRequest from './MainRequest';
export declare class RabbitSender {
    protected connection: any;
    protected aQuery: {
        [key: string]: RabbitQueue;
    };
    constructor(connection: any);
    sendToQueue(sQueue: string, msg: any): void;
    close(): void;
    static Init(req: MainRequest, queryList: string[]): Promise<RabbitSender>;
}
declare class RabbitQueue {
    sQuery: string;
    conn: any;
    channel: any;
    constructor(sQuery: any, conn: any, channel: any);
    static init(conn: any, sQuery: any): RabbitQueue;
    sendToQueue(msg: any): void;
}
export {};
