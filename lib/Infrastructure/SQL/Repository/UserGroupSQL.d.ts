import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
/**
 * Здесь методы для SQL запросов
 * - Управление группами пользователей
 */
export declare class UserGroupSQL extends BaseSQL {
    constructor(req: MainRequest);
    /**
     * Получить Группы/Роли пользователя по user_id
     *
     * @param integer idUser
     * @return array|null
     */
    getUserGroupsByUserID(idUser: number): Promise<any>;
    /**
     * Добавить пользователя в группу - дать Роль
     * Группа/Роль
     *
     * @param integer idUser
     * @param integer idGroup
     * @return array|null
     */
    addUserToGroup(idUser: number, idGroup: number): Promise<boolean>;
    /**
     * Удалить пользователя из группы - убрать Роль
     * Группа/Роль
     *
     * @param integer idUser
     * @param integer idGroup
     * @return array|null
     */
    delUserFromGroup(idUser: number, idGroup: number): Promise<boolean>;
}
