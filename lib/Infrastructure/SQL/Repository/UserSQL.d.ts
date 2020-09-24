import BaseSQL from '../../../System/BaseSQL';
import { UserInfoI } from '../../../System/UserSys';
/**
 * Здесь методы для SQL запросов
 */
export declare class UserSQL extends BaseSQL {
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
    fGetUserInfoByApiKey(apikey?: string): Promise<UserInfoI>;
    /**
     * проверка на то что есть apikey в базе
     */
    isAuth(apikey?: string): Promise<boolean>;
    getUserIdByPhoneAndSms(phone: string, sms: string): Promise<number>;
    getUserByUsername(username: string): Promise<any[]>;
    getUserApiKey(user_id: number): Promise<string>;
    insertUserApiKey(user_id: number): Promise<string>;
    generateApiKey(max?: number): string;
    fGetUserInfoById(userId: number): Promise<any[]>;
}
