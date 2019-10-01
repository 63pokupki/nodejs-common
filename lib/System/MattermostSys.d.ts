import MainRequest from './MainRequest';
import { ErrorSys } from './ErrorSys';
interface MattermostField {
    short: boolean;
    title: string;
    value: string;
}
interface MattermostMsg {
    attachments: {
        fallback: string;
        color: string;
        text: string;
        title: string;
        fields: MattermostField[];
    }[];
}
/**
 * Класс для роботы с S3 like
 */
export declare class MattermostSys {
    protected req: MainRequest;
    protected errorSys: ErrorSys;
    constructor(req: MainRequest);
    sendMsg(): void;
    /**
     * Отправить ошибку
     * @param errorSys
     * @param err
     * @param addMessage
     */
    sendErrorMsg(errorSys: ErrorSys, err: Error, addMessage: string): void;
    /**
     * отправить сообщение
     * @param msg
     */
    send(msg: MattermostMsg): void;
}
export {};
