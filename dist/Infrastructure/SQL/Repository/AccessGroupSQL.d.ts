import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
export declare class AccessGroupSQL extends BaseSQL {
    constructor(req: MainRequest);
    getCtrlAccessOfGroupByID(idGroup: number): Promise<any>;
    getAccessCRUD(aIdsGroup: number[], idCtrlAccess: number): Promise<any>;
    getAccess(aIdsGroup: number[], idCtrlAccess: number): Promise<boolean>;
    addCtrlAccessToGroup(idCtrlAccess: number, idGroup: number): Promise<number>;
    saveAccessGroup(idAccessGroup: number, data: {
        [key: string]: any;
    }): Promise<boolean>;
    delCtrlAccessFromGroup(idCtrlAccess: number, idGroup: number): Promise<boolean>;
    cntAccessGroup(idCtrlAccess: number, idGroup: number): Promise<number>;
}
