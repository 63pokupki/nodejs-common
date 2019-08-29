import MainRequest from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
/**
 * Здесь методы для SQL запросов
 * - Группы пользователей
 */
export declare class CtrlAccessSQL extends BaseSQL {
    constructor(req: MainRequest);
    /**
     * Получить контроллер доступа по Alias
     *
     * @param string aliasCtrlAccess
     * @return array|null
     */
    getCtrlAccessByAlias(aliasCtrlAccess: string): Promise<any>;
    /**
     * Получить контроллер доступа по ID
     *
     * @param integer idCtrlAccess
     * @return array|null
     */
    getCtrlAccessByID(idCtrlAccess: number): Promise<any>;
    /**
     * Получить список контроллеров доступа
     *
     * @return array|null
     */
    getAllCtrlAccess(): Promise<any>;
    /**
     * Сохранить контроллер доступа
     *
     * @param integer idCtrlAccess
     * @return boolean
     */
    saveCtrlAccess(idCtrlAccess: number, data: {
        [key: string]: any;
    }): Promise<boolean>;
    /**
     * Добавить контроль доступа
     *
     * @return boolean
     */
    addCtrlAccess(data: {
        [key: string]: any;
    }): Promise<boolean>;
    /**
     * удалить контроллер доступа по ID
     *
     * @param string aliasCtrlAccess
     * @return boolean
     */
    delCtrlAccessByAlias(aliasCtrlAccess: string): Promise<boolean>;
    /**
     * Проверить наличия контроллера доступа по ALIAS
     * Alias униакльное поле потому LIMIT 1
     *
     * @param string aliasCtrlAccess
     * @return integer
     */
    cntCtrlAccessByAlias(aliasCtrlAccess: string): Promise<number>;
}
