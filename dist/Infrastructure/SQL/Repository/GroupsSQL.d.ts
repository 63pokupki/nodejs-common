import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
export declare class GroupsSQL extends BaseSQL {
    constructor(req: MainRequest);
    getGroupByID(idGroup: number): Promise<any>;
    getAllGroups(): Promise<any>;
    saveGroup(idGroup: number, data: {
        [key: string]: any;
    }): Promise<boolean>;
}
