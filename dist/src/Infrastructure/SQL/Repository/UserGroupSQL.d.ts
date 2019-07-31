import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
export declare class UserGroupSQL extends BaseSQL {
    constructor(req: MainRequest);
    getUserGroupsByUserID(idUser: number): Promise<any>;
    addUserToGroup(idUser: number, idGroup: number): Promise<boolean>;
    delUserFromGroup(idUser: number, idGroup: number): Promise<boolean>;
}
