import { MainRequest } from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
/**
 * Здесь методы для SQL запросов
 * - Связка Групп пользователей с модулями
 */
export declare class AccessGroupSQL extends BaseSQL {
    constructor(req: MainRequest);
    /**
     * Получить список модулей доступных группе по ID Группы
     *
     * @param integer idGroup
     * @return array|null
     */
    getCtrlAccessOfGroupByID(idGroup: number): Promise<any>;
    /**
     * Получить права CRUD по конкретному модулю
     * на основе групп к которым принадлежит пользователь
     *
     * @param array aIdGroup
     * @param integer idCtrlAccess
     * @return array|null
     */
    getAccessCRUD(aIdsGroup: number[], idCtrlAccess: number): Promise<any>;
    /**
     * Получить права на доступ к модулю
     * на основе групп к которым принадлежит пользователь
     *
     * @param array aIdGroup
     * @param integer idCtrlAccess
     * @return array|null
     */
    getAccess(aIdsGroup: number[], idCtrlAccess: number): Promise<boolean>;
    /**
     * Добавить контроль доступа к группе
     *
     * @return boolean
     */
    addCtrlAccessToGroup(idCtrlAccess: number, idGroup: number): Promise<number>;
    /**
     * Изменить параметры доступа
     *
     * @param integer idAccessGroup
     * @return boolean
     */
    saveAccessGroup(idAccessGroup: number, data: {
        [key: string]: any;
    }): Promise<boolean>;
    /**
     * удалить права на модуль у группы
     *
     * @param string idCtrlAccess
     * @param string idGroup
     * @return boolean
     */
    delCtrlAccessFromGroup(idCtrlAccess: number, idGroup: number): Promise<boolean>;
    /**
     * Проверить наличие связи между модулем и группой
     * связь модуля и группы должна быть только одна
     *
     * @param idCtrlAccess:number
     * @param idGroup:number
     * @return integer
     */
    cntAccessGroup(idCtrlAccess: number, idGroup: number): Promise<number>;
}
