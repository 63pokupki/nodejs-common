import MainRequest from './MainRequest';
/**
 * Класс который глобально знает все данные пользователя
 */
export declare class UserSys {
    idUser: number;
    private apikey;
    private userInfoList;
    private userGroupsList;
    private ctrlAccessList;
    private aliasCtrlAccess;
    private idCtrlAccess;
    private accessCRUDList;
    private req;
    private userSQL;
    private errorSys;
    private userGroupSQL;
    private accessGroupSQL;
    private ctrlAccessSQL;
    constructor(req: MainRequest);
    /**
     * Инициализация данных пользователя
     * только если this.isAuth() == true
     *
     * @return void
     */
    init(): Promise<void>;
    /**
     * Получения доступа на контроллер
     *
     * @param string alias
     * @return boolean
     */
    isAccessCtrl(alias: string): Promise<boolean>;
    /**
     * Доступ на CRUD
     * - Создание
     *
     * @return boolean
     */
    isAccessCreate(): boolean;
    /**
     * Доступ на CRUD
     * - Чтение
     *
     * @return boolean
     */
    isAccessRead(): boolean;
    /**
     * Доступ на CRUD
     * - Обновление
     *
     * @return boolean
     */
    isAccessUpdate(): boolean;
    /**
     * Доступ на CRUD
     * - Удаление
     *
     * @return boolean
     */
    isAccessDelete(): boolean;
    /**
     * Проверка является ли пользователь организатором
     *
     * @return boolean
     */
    isOrg(): boolean;
    /**
     * Проверка является ли пользователь администратором организаторов на пр Ольга Проданова
     *
     * @return boolean
     */
    isOrgAdmin(): boolean;
    /**
     * Проверка является ли пользователь администратором
     *
     * @return boolean
     */
    isAdmin(): boolean;
    /**
     * Проверка является ли пользователь авторизированным
     */
    isAuth(): Promise<boolean>;
    /**
     * возвращает apikey
     *
     * @return string|null
     */
    fGetApikey(): string;
    /**
     * Получить ID пользователя
     */
    getIdUser(): number;
    /**
     * Список ID групп в которых состоит пользователь
     */
    getUserGroupIds(): number[];
    /**
     * Проверяет состоит ли пользователь в группе
     * @param groupAlias Алиас группы на принадлежность к которой нужно проверить пользователя
     */
    isUserInGroup(groupAlias: string): boolean;
}
