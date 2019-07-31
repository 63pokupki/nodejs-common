import MainRequest from './MainRequest';
export declare class ErrorSys {
    private ok;
    private env;
    private ifDevMode;
    private errorList;
    private errorDeclareList;
    private devWarningList;
    private warningList;
    private devNoticeList;
    private noticeList;
    private devLogList;
    constructor(req: MainRequest);
    isOk(): boolean;
    isDev(): boolean;
    decl(keyError: string, infoError?: string): void;
    declare(keyErrorList: string[]): void;
    declareEx(keyErrorList: {
        [key: string]: string;
    }): void;
    error(kError: string, sError: string): void;
    err(kError: string): void;
    errorEx(e: any, kError: string, sError: string): void;
    notice(kNotice: string, sNotice: string): void;
    devNotice(kNotice: string, sNotice: string): void;
    warning(kWarning: string, sWarning: string): void;
    devWarning(kWarning: string, sWarning: string): void;
    getErrors(): {};
    getDevDeclare(): {};
    getDevWarning(): {};
    getWarning(): {};
    getDevNotice(): {};
    getNotice(): {};
    getDevLog(): string[];
}
