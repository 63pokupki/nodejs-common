import MainRequest from './MainRequest';
import { ErrorSys } from './ErrorSys';
/**
 * Класс для роботы с S3 like
 */
export declare class MattermostSys {
    protected req: MainRequest;
    protected errorSys: ErrorSys;
    constructor(req: MainRequest);
    sendMsg(): void;
}
