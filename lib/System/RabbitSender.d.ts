import { MainRequest } from './MainRequest';
export declare class RabbitSender {
    private query;
    private connection;
    private channel;
    constructor(query: string, connection: any, channel: any);
    sendToQueue(msg: any): void;
    close(): void;
    static Init(req: MainRequest, query: string): Promise<RabbitSender>;
}
