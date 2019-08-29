import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
/**
 * Здесь методы для SQL запросов
 * - Группы пользователей
 */
export declare class GroupsSQL extends BaseSQL {
    constructor(req: MainRequest);
    /**
     * Получить группу по ID
     *
     * @param integer idGroup
     * @return array|null
     */
    getGroupByID(idGroup: number): Promise<any>;
    /**
     * Получить группы/роли
     *
     * @return array|null
     */
    getAllGroups(): Promise<any>;
    /**
     * Сохранить группу по ID
     *
     * @param integer idGroup
     * @return boolean
     */
    saveGroup(idGroup: number, data: {
        [key: string]: any;
    }): Promise<boolean>;
}
