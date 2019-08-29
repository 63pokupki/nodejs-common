"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Библиотеки
const _ = require("lodash");
// SQL Запросы
const UserSQL_1 = require("../Infrastructure/SQL/Repository/UserSQL");
const UserGroupSQL_1 = require("../Infrastructure/SQL/Repository/UserGroupSQL");
const AccessGroupSQL_1 = require("../Infrastructure/SQL/Repository/AccessGroupSQL");
const CtrlAccessSQL_1 = require("../Infrastructure/SQL/Repository/CtrlAccessSQL");
/**
 * Клас который глобально знает все данные пользователя
 */
class UserSys {
    constructor(req) {
        this.req = req;
        this.errorSys = req.sys.errorSys;
        this.userSQL = new UserSQL_1.UserSQL(req);
        this.userGroupSQL = new UserGroupSQL_1.UserGroupSQL(req);
        this.accessGroupSQL = new AccessGroupSQL_1.AccessGroupSQL(req);
        this.ctrlAccessSQL = new CtrlAccessSQL_1.CtrlAccessSQL(req);
        this.ctrlAccessList = {};
        this.userGroupsList = {};
        this.accessCRUDList = {};
        /* вылавливаем apikey */
        this.apikey = req.sys.apikey;
        if (!this.apikey) {
            this.apikey = '';
            this.errorSys.devWarning('apikey', 'apikey - пустой');
        }
    }
    /**
     * Инициализация данных пользователя
     * тольrо если this.isAuth() == true
     *
     * @return void
     */
    async init() {
        let ok = this.errorSys.isOk(); // По умолчанию true
        // Проверяем apikey
        let ifAuth = await this.userSQL.isAuth(this.apikey);
        if (ifAuth) { // Ставим в общий слой видимости флаг авторизации
            this.req.sys.bAuth = true;
        }
        let userInfoList = {};
        if (ok && ifAuth) { // Получаем информацию о пользователе по apikey
            userInfoList = await this.userSQL.fGetUserInfoByApiKey(this.apikey);
            if (!userInfoList) {
                ok = false;
                this.errorSys.error('get_user_info_in_auth', 'Не возомжно получить данные пользователя при авторизации');
            }
            else {
                this.userInfoList = userInfoList;
                this.idUser = userInfoList['user_id'];
            }
        }
        let userGroupsList = {};
        if (ok && ifAuth) { // Получаем роли пользователя
            userGroupsList = await this.userGroupSQL.getUserGroupsByUserID(this.idUser);
            if (!userGroupsList) {
                ok = false;
                this.errorSys.error('get_user_roles_in_auth', 'Не возомжно получить роли пользователя при авторизации');
            }
        }
        this.userGroupsList = {};
        if (ok && ifAuth) { // Проиндексировать группы по: имени группы
            _.forEach(userGroupsList, (v, k) => {
                let idGroup = v['group_id'];
                let aliasGroup = v['alias'];
                if (aliasGroup) {
                    this.userGroupsList[aliasGroup] = idGroup;
                }
            });
        }
        let ctrlAccessListTemp = {};
        if (ok) { // Получаем все модули
            ctrlAccessListTemp = await this.ctrlAccessSQL.getAllCtrlAccess();
            if (!userGroupsList) {
                ok = false;
                this.errorSys.error('get_all_ctrl_access', 'Не получилось получить список модулей');
            }
        }
        if (ok) { // Проиндексировать модули по: alias модуля
            _.forEach(ctrlAccessListTemp, (v, k) => {
                let idCtrlAccess = v['id'];
                let aliasCtrlAccess = v['alias'];
                if (aliasCtrlAccess) {
                    this.ctrlAccessList[aliasCtrlAccess] = idCtrlAccess;
                }
            });
        }
        if (ok && ifAuth) { // Уведоиление об успешной авторизации пользователя в DEV режиме
            this.errorSys.devNotice('is_user_init', 'Авторизация прошла успешно, пользователь - ' + userInfoList['username']);
        }
        else {
            this.errorSys.devWarning('is_user_init', 'Авторизация провалилась');
        }
    }
    /**
     * Получения доступа на контроллер
     *
     * @param string alias
     * @return boolean
     */
    async isAccessCtrl(alias) {
        let ok = true;
        if (this.ctrlAccessList[alias]) { // Проверяем существование модуля
            this.errorSys.devNotice('ctrl_access_exist', `Модуль - ${alias} найден`);
            this.idCtrlAccess = this.ctrlAccessList[alias];
            this.aliasCtrlAccess = alias;
        }
        else {
            ok = false;
            this.errorSys.error('ctrl_access_no_exist', `Модуля ${alias} - не существует`);
        }
        let idsGroupList = [];
        if (ok) { // Получаем ID групп в которых состоит пользователь
            idsGroupList = _.values(this.userGroupsList);
        }
        let ifCtrlAccess = false;
        if (ok) { // Проверяем имеет ли пользователь доступ к модулю
            ifCtrlAccess = await this.accessGroupSQL.getAccess(idsGroupList, this.idCtrlAccess);
            if (!ifCtrlAccess) {
                ok = false;
                this.errorSys.error('get_access', 'Не возможно получить права на контрллер');
            }
        }
        let accessCRUDList = [];
        if (ok) { // Получаем CRUD права на модуль
            accessCRUDList = await this.accessGroupSQL.getAccessCRUD(idsGroupList, this.idCtrlAccess);
            if (!accessCRUDList) {
                ok = false;
                this.errorSys.error('get_access_crud', 'Не возможно получить CRUD права на контрллер');
            }
        }
        this.accessCRUDList = accessCRUDList;
        if (ifCtrlAccess) {
            this.errorSys.devNotice("ctrl_access", `Доступ к ${alias} получен`);
        }
        else {
            this.errorSys.error('ctrl_access', `У вас нет доступа к ${alias}`);
        }
        return ifCtrlAccess;
    }
    /**
     * Доступ на CRUD
     * - Создание
     *
     * @return boolean
     */
    isAccessCreate() {
        let ok = this.errorSys.isOk();
        this.errorSys.declare([
            'crud_access_list',
            'access_create'
        ]);
        if (!this.accessCRUDList) {
            ok = false;
            this.errorSys.error('crud_access_list', 'Нет списка прав');
        }
        if (ok) {
            if (this.accessCRUDList['create']) {
                this.errorSys.devNotice('access_create', "Проверка прав на create прошла успешно");
            }
            else {
                ok = false;
                this.errorSys.error('access_create', 'У вас нет прав на create');
            }
        }
        return ok;
    }
    /**
     * Доступ на CRUD
     * - Чтение
     *
     * @return boolean
     */
    isAccessRead() {
        let ok = this.errorSys.isOk();
        this.errorSys.declare([
            'crud_access_list',
            'access_read'
        ]);
        if (!this.accessCRUDList) {
            ok = false;
            this.errorSys.error('crud_access_list', 'Нет списка прав');
        }
        if (ok) {
            if (this.accessCRUDList['read']) {
                this.errorSys.devNotice('access_read', "Проверка прав на read прошла успешно");
            }
            else {
                ok = false;
                this.errorSys.error('access_read', 'У вас нет прав на read');
            }
        }
        return ok;
    }
    /**
     * Доступ на CRUD
     * - Обновление
     *
     * @return boolean
     */
    isAccessUpdate() {
        let ok = this.errorSys.isOk();
        this.errorSys.declare([
            'crud_access_list',
            'access_update'
        ]);
        if (!this.accessCRUDList) {
            ok = false;
            this.errorSys.error('crud_access_list', 'Нет списка прав');
        }
        if (ok) {
            if (this.accessCRUDList['update']) {
                this.errorSys.devNotice('access_update', "Проверка прав на update прошла успешно");
            }
            else {
                ok = false;
                this.errorSys.error('access_update', 'У вас нет прав на обновление');
            }
        }
        return ok;
    }
    /**
     * Доступ на CRUD
     * - Удаление
     *
     * @return boolean
     */
    isAccessDelete() {
        let ok = this.errorSys.isOk();
        this.errorSys.declare([
            'crud_access_list',
            'access_delete'
        ]);
        if (!this.accessCRUDList) {
            ok = false;
            this.errorSys.error('crud_access_list', 'Нет списка прав');
        }
        if (ok) {
            if (this.accessCRUDList['delete']) {
                this.errorSys.devNotice('access_delete', "Проверка прав на delete прошла успешно");
            }
            else {
                ok = false;
                this.errorSys.error('access_delete', 'У вас нет прав на delete');
            }
        }
        return ok;
    }
    /**
     * Проверка является ли пользователь организатором
     *
     * @return boolean
     */
    isOrg() {
        let ok = this.errorSys.isOk();
        this.errorSys.declare([
            'is_org'
        ]);
        if (ok && this.userGroupsList['organizers']) {
            this.errorSys.devNotice('is_org', 'Вы организатор');
        }
        else {
            ok = false;
            this.errorSys.error('is_org', 'Вы не организатор');
        }
        return ok;
    }
    /**
     * Проверка является ли пользователь администратором организаторов на пр Ольга Проданова
     *
     * @return boolean
     */
    isOrgAdmin() {
        return this.isAdmin() ? (true) : (false);
    }
    /**
     * Проверка является ли пользователь администратором
     *
     * @return boolean
     */
    isAdmin() {
        let ok = this.errorSys.isOk();
        this.errorSys.declare([
            'is_admin'
        ]);
        if (ok && this.userGroupsList['administrators']) {
            this.errorSys.devNotice('is_admin', 'Вы администратор');
        }
        else {
            ok = false;
            this.errorSys.error('is_admin', 'Вы не администратор');
        }
        return ok;
    }
    /**
     * Проверка является ли пользователь авторизированным
     */
    async isAuth() {
        let ok = this.errorSys.isOk();
        this.errorSys.declare([
            'is_auth'
        ]);
        if (ok && await this.userSQL.isAuth(this.apikey)) {
            this.errorSys.devNotice('is_auth', 'Вы авторизованы');
        }
        else {
            ok = false;
            this.errorSys.error('is_auth', 'Вы не авторизованы');
        }
        return ok;
    }
    /**
     * возвращает apikey
     *
     * @return string|null
     */
    fGetApikey() {
        return this.apikey;
    }
    /**
     * Получить ID пользователя
     */
    getIdUser() {
        return this.idUser;
    }
}
exports.UserSys = UserSys;
//# sourceMappingURL=UserSys.js.map