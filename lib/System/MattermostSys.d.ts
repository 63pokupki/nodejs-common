import { MainRequest } from './MainRequest';
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
 * Класс для работы с MatterMost'ом
 */
export declare class MattermostSys {
    protected req: MainRequest;
    protected errorSys: ErrorSys;
    constructor(req: MainRequest);
    /**
     * Отправить сообщение в чат monitoring
     * todo: доделать отправку данных извне
     */
    sendMonitoringMsg(): void;
    /**
     * Отправить сообщение об ошибке в чат errors
     * @param errorSys
     * @param err
     * @param addMessage
     */
    sendErrorMsg(errorSys: ErrorSys, err: Error, addMessage: string): void;
    /**
     * Отправить сообщение по мониторингу RabbitMQ
     * @param ixParam - key = очередь, val = количество картинок
     */
    sendMonitoringRabbitQueue(ixParam: {
        [key: string]: string;
    }): void;
    /**
     * общий метод для отправки сообщения
     * @param msg
     * @param hook_url
     */
    send(msg: MattermostMsg, hook_url: string): void;
}
export {};
