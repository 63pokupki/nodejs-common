
// Библиотеки
import * as _ from 'lodash';

// Системные сервисы
import MainRequest from './MainRequest';

import {ErrorSys} from './ErrorSys';


// SQL Запросы
import {UserSQL} from '../Infrastructure/SQL/Repository/UserSQL';
import {UserGroupSQL} from '../Infrastructure/SQL/Repository/UserGroupSQL';
import {AccessGroupSQL} from '../Infrastructure/SQL/Repository/AccessGroupSQL';
import {CtrlAccessSQL} from '../Infrastructure/SQL/Repository/CtrlAccessSQL';

/**
 * Клас который глобально знает все данные пользователя
 */
export class UserSys
{


	public idUser:number; // ID пользователя

	private apikey:string; // APIKEY

	private userInfoList:any; // Информация о пользователе
	private userGroupsList:any; // Роли пользователя

	private ctrlAccessList:any; // Список модулей
	private aliasCtrlAccess:string; // Псевдоним модуля где мы находимся
	private idCtrlAccess:number; // ID модуля где мы находимся
	private accessCRUDList:any; // Доступ CRUD к модулю

	private req:MainRequest; // Объект запроса пользователя


	private userSQL:UserSQL;

	private errorSys:ErrorSys;

	private userGroupSQL:UserGroupSQL;

	private accessGroupSQL:AccessGroupSQL;

	private ctrlAccessSQL:CtrlAccessSQL;

	public constructor (req:MainRequest) {

		this.req = req;

		this.errorSys = req.sys.errorSys;

		this.userSQL = new UserSQL(req);
		this.userGroupSQL = new UserGroupSQL(req);
		this.accessGroupSQL = new AccessGroupSQL(req);
		this.ctrlAccessSQL = new CtrlAccessSQL(req);


		this.ctrlAccessList = {};
		this.userGroupsList = {};
		this.accessCRUDList = {};

		/* вылавливаем apikey */

		this.apikey = req.sys.apikey;

		if( !this.apikey ){
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
	public async init(){
		let ok = this.errorSys.isOk(); // По умолчанию true

		// Проверяем apikey
		let ifAuth = await this.userSQL.isAuth(this.apikey);

		if( ifAuth ){ // Ставим в общий слой видимости флаг авторизации
			this.req.sys.bAuth = true;
		}

		let userInfoList:any = {};
		if( ok && ifAuth ){ // Получаем информацию о пользователе по apikey
			userInfoList = await this.userSQL.fGetUserInfoByApiKey(this.apikey);

			if( !userInfoList ){
				ok = false;
				this.errorSys.error('get_user_info_in_auth', 'Не возомжно получить данные пользователя при авторизации');
			} else {
				this.userInfoList = userInfoList;
				this.idUser = userInfoList['user_id'];
			}
		}

		let userGroupsList = {};
		if( ok && ifAuth ){ // Получаем роли пользователя

			userGroupsList = await this.userGroupSQL.getUserGroupsByUserID(this.idUser);

			if( !userGroupsList ){
				ok = false;
				this.errorSys.error('get_user_roles_in_auth', 'Не возомжно получить роли пользователя при авторизации');
			}
		}


		this.userGroupsList = {};
		if( ok && ifAuth ){ // Проиндексировать группы по: имени группы
			_.forEach(userGroupsList, (v, k) => {
				let idGroup = v['group_id'];
				let aliasGroup = v['alias'];

				if( aliasGroup ){
					this.userGroupsList[aliasGroup] = idGroup;
				}
			});
		}



		let ctrlAccessListTemp = {};
		if( ok ){ // Получаем все модули

			ctrlAccessListTemp = await this.ctrlAccessSQL.getAllCtrlAccess();

			if( !userGroupsList ){
				ok = false;
				this.errorSys.error('get_all_ctrl_access', 'Не получилось получить список модулей');
			}
		}


		if( ok ){ // Проиндексировать модули по: alias модуля

			_.forEach(ctrlAccessListTemp, (v, k) =>{
				let idCtrlAccess = v['id'];
				let aliasCtrlAccess = v['alias'];

				if( aliasCtrlAccess ){
					this.ctrlAccessList[aliasCtrlAccess] = idCtrlAccess;
				}
			});
		}

		if( ok && ifAuth ){ // Уведоиление об успешной авторизации пользователя в DEV режиме
			this.errorSys.devNotice('is_user_init', 'Авторизация прошла успешно, пользователь - '+userInfoList['username']);
		} else {
			this.errorSys.devWarning('is_user_init', 'Авторизация провалилась');
		}

	}

	/**
	 * Получения доступа на контроллер
	 *
	 * @param string alias
	 * @return boolean
	 */
	public async isAccessCtrl(alias:string): Promise<boolean>{

		let ok = true;

		if( this.ctrlAccessList[alias] ){ // Проверяем существование модуля
			this.errorSys.devNotice('ctrl_access_exist', `Модуль - ${alias} найден`);
			this.idCtrlAccess = this.ctrlAccessList[alias];
			this.aliasCtrlAccess = alias;
		} else {
			ok = false;
			this.errorSys.error('ctrl_access_no_exist', `Модуля ${alias} - не существует`);
		}

		let idsGroupList = [];
		if( ok ){ // Получаем ID групп в которых состоит пользователь
			idsGroupList = _.values(this.userGroupsList);
		}

		let ifCtrlAccess = false;
		if( ok ){ // Проверяем имеет ли пользователь доступ к модулю

			ifCtrlAccess = await this.accessGroupSQL.getAccess(idsGroupList, this.idCtrlAccess);

			if( !ifCtrlAccess ){
				ok = false;
				this.errorSys.error('get_access', 'Не возможно получить права на контрллер');
			}
		}

		let accessCRUDList = [];
		if( ok ){ // Получаем CRUD права на модуль

			accessCRUDList = await this.accessGroupSQL.getAccessCRUD(idsGroupList, this.idCtrlAccess);

			if( !accessCRUDList ){
				ok = false;
				this.errorSys.error('get_access_crud', 'Не возможно получить CRUD права на контрллер');
			}
		}

		this.accessCRUDList = accessCRUDList;

		if( ifCtrlAccess ){
            this.errorSys.devNotice("ctrl_access", `Доступ к ${alias} получен`);
        } else {
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
	public isAccessCreate(): boolean {

		let ok = this.errorSys.isOk();

		this.errorSys.declare([
			'crud_access_list',
			'access_create'
		]);

		if( !this.accessCRUDList ){
			ok = false;
			this.errorSys.error('crud_access_list', 'Нет списка прав');
		}

		if( ok ){
			if( this.accessCRUDList['create'] ){
				this.errorSys.devNotice('access_create', "Проверка прав на create прошла успешно");
			} else {
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
	public isAccessRead(): boolean {
		let ok = this.errorSys.isOk();

		this.errorSys.declare([
			'crud_access_list',
			'access_read'
		]);

		if( !this.accessCRUDList ){
			ok = false;
			this.errorSys.error('crud_access_list', 'Нет списка прав');
		}

		if( ok ){
			if( this.accessCRUDList['read'] ){
				this.errorSys.devNotice('access_read', "Проверка прав на read прошла успешно");
			} else {
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
	public isAccessUpdate(): boolean {
		let ok = this.errorSys.isOk();

		this.errorSys.declare([
			'crud_access_list',
			'access_update'
		]);

		if( !this.accessCRUDList ){
			ok = false;
			this.errorSys.error('crud_access_list', 'Нет списка прав');
		}

		if( ok ){
			if( this.accessCRUDList['update'] ){
				this.errorSys.devNotice('access_update', "Проверка прав на update прошла успешно");
			} else {
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
	public isAccessDelete(): boolean {
		let ok = this.errorSys.isOk();

		this.errorSys.declare([
			'crud_access_list',
			'access_delete'
		]);

		if( !this.accessCRUDList ){
			ok = false;
			this.errorSys.error('crud_access_list', 'Нет списка прав');
		}

		if( ok ){
			if( this.accessCRUDList['delete'] ){
				this.errorSys.devNotice('access_delete', "Проверка прав на delete прошла успешно");
			} else {
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
	public isOrg(): boolean {

		let ok = this.errorSys.isOk();

		this.errorSys.declare([
			'is_org'
		]);

		if( ok && this.userGroupsList['organizers'] ){
			this.errorSys.devNotice('is_org', 'Вы организатор');
		} else {
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
	public isOrgAdmin(): boolean {
		return this.isAdmin() ? (true) : (false);
	}

	/**
	 * Проверка является ли пользователь администратором
	 *
	 * @return boolean
	 */
	public isAdmin(): boolean {

		let ok = this.errorSys.isOk();

		this.errorSys.declare([
			'is_admin'
		]);

		if( ok && this.userGroupsList['administrators'] ){
			this.errorSys.devNotice('is_admin', 'Вы администратор');
		} else {
			ok = false;
			this.errorSys.error('is_admin', 'Вы не администратор');
		}

		return ok;
	}

	/**
	 * Проверка является ли пользователь авторизированным
	 */
	public async isAuth(): Promise<boolean> {

		let ok = this.errorSys.isOk();

		this.errorSys.declare([
			'is_auth'
		]);

		if( ok && await this.userSQL.isAuth(this.apikey) ){
            this.errorSys.devNotice('is_auth', 'Вы авторизованы');
        } else {
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
	public fGetApikey(): string{
		return this.apikey;
	}

	/**
	 * Получить ID пользователя
	 */
	public getIdUser(): number{
		return this.idUser;
	}

}
