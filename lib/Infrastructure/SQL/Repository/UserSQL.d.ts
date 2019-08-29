import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
/**
 * Здесь методы для SQL запросов
 */
export declare class UserSQL extends BaseSQL {
    constructor(req: MainRequest);
    /**
     * Получить список пользователей
     *
     * @param integer iOffset
     * @param integer iLimit
     * @param array sSearchFIO
     * @return array|null
     */
    getUserList(iOffset: number, iLimit: number, aFilter: {
        [key: string]: any;
    }): Promise<any>;
    /**
     * Получить пользователя по ID
     *
     * @param integer idUser
     * @return array|null
     */
    getUserByID(idUser: number): Promise<any>;
    fGetUserInfoByApiKey(apikey?: string): Promise<any>;
    /**
     * проверка на то что есть apikey в базе
     */
    isAuth(apikey?: string): Promise<boolean>;
    getUserIdByPhoneAndSms(phone: string, sms: string): Promise<number>;
    getUserByUsername(username: string): Promise<any[]>;
    getUserApiKey(user_id: number): Promise<string>;
    insertUserApiKey(user_id: number): Promise<string>;
    generateApiKey(max?: number): any;
    fGetUserInfoById(userId: number): Promise<any[]>;
}
