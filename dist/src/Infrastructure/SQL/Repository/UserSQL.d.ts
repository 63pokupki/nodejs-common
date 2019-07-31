import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
export declare class UserSQL extends BaseSQL {
    constructor(req: MainRequest);
    getUserList(iOffset: number, iLimit: number, aFilter: {
        [key: string]: any;
    }): Promise<any>;
    getUserByID(idUser: number): Promise<any>;
    fGetUserInfoByApiKey(apikey?: string): Promise<any>;
    isAuth(apikey?: string): Promise<boolean>;
    getUserIdByPhoneAndSms(phone: string, sms: string): Promise<number>;
    getUserByUsername(username: string): Promise<any[]>;
    getUserApiKey(user_id: number): Promise<string>;
    insertUserApiKey(user_id: number): Promise<string>;
    generateApiKey(max?: number): any;
    fGetUserInfoById(userId: number): Promise<any[]>;
}
