export interface RabbitSenderI {
    filename: string;
    source_url: string;
}
export declare class RabbitSenderSys {
    protected connection: any;
    aQuery: {
        [key: string]: RabbitQueue;
    };
    constructor(connection: any);
    sendToQueue(sQueue: string, msg: any): void;
    close(): void;
    static Init(confConnect: string, queryList: string[]): Promise<RabbitSenderSys>;
}
declare class RabbitQueue {
    sQuery: string;
    conn: any;
    sendToQueue(msg: any): void;
    channel: any;
    constructor(sQuery: any, conn: any, channel: any);
    static init(conn: any, sQuery: any): Promise<RabbitQueue>;
}
export {};
