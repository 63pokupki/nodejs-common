import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
export declare class CtrlAccessSQL extends BaseSQL {
    constructor(req: MainRequest);
    getCtrlAccessByAlias(aliasCtrlAccess: string): Promise<any>;
    getCtrlAccessByID(idCtrlAccess: number): Promise<any>;
    getAllCtrlAccess(): Promise<any>;
    saveCtrlAccess(idCtrlAccess: number, data: {
        [key: string]: any;
    }): Promise<boolean>;
    addCtrlAccess(data: {
        [key: string]: any;
    }): Promise<boolean>;
    delCtrlAccessByAlias(aliasCtrlAccess: string): Promise<boolean>;
    cntCtrlAccessByAlias(aliasCtrlAccess: string): Promise<number>;
}
