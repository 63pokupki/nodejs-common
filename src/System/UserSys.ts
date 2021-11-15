// Библиотеки
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import * as _ from 'lodash';

// Системные сервисы
import { MainRequest } from './MainRequest';

// SQL Запросы
import { UserSQL } from '../Infrastructure/SQL/Repository/UserSQL';
import { AccessGroupSQL } from '../Infrastructure/SQL/Repository/AccessGroupSQL';
import { RolesT } from './RolesI';
import { AuthR, UserInfoI } from '../Interface/AuthUser';
import { QuerySys } from '@a-a-game-studio/aa-front';


/**
 * Класс который глобально знает все данные пользователя
 */
export class UserSys {
	public idUser = 0; // ID пользователя

	private apikey: string; // APIKEY

	private userInfo: UserInfoI; // Информация о пользователе

	private userGroupsList: any; // Роли пользователя

	private ctrlAccessList: any; // Список модулей

	private aliasCtrlAccess: string; // Псевдоним модуля где мы находимся

	private idCtrlAccess: number; // ID модуля где мы находимся

	private accessCRUDList: any; // Доступ CRUD к модулю

	private req: MainRequest; // Объект запроса пользователя

	private userSQL: UserSQL;

	private errorSys: ErrorSys;

	private accessGroupSQL: AccessGroupSQL;

	public constructor(req: MainRequest) {
		this.req = req;

		this.errorSys = req.sys.errorSys;

		this.userSQL = new UserSQL(req);
		this.accessGroupSQL = new AccessGroupSQL(req);

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
	 * только если this.isAuth() == true
	 *
	 * @return void
	 */
	public async init(): Promise<void> {
		const querySys = new QuerySys();
		querySys.fInit();
		
		const reqData: AuthR.authByApikey.RequestI = {
			apikey: this.apikey,
		};

		// Запрос к сервису авторизации
		querySys.fActionOk((data: AuthR.authByApikey.ResponseI)=> {
			if (data.user_info) {
				// Основная информация о пользователе:
				this.idUser = data.user_info.user_id;
				this.req.sys.bAuth = true;
				if (this.req.common.env !== 'prod') console.log('au Auth.core done');
				this.req.sys.errorSys.devNotice(
					'is_user_init_by_auth', `Авторизация через Auth.Core прошла успешно, пользователь - ${data.user_info.username}`
				);

				// сохраняем группы пользователя
				for (let i = 0; i < data.list_group.length; i++) {
					const group = data.list_group[i];
					this.userGroupsList[group.group_alias] = group.group_id;
				}

				// сохраняем доступные пользователю контроллеры
				for (let i = 0; i < data.list_ctrl.length; i++) {
					const ctrl = data.list_ctrl[i];
					this.ctrlAccessList[ctrl.ctrl_alias] = ctrl.ctrl_id;
				}

			} else {
				this.errorSys.devWarning('is_user_init', 'Пользователь не авторизован');
			}
			
		});
		querySys.fActionErr((e: Record<string, string>) => {
			this.errorSys.devWarning('is_user_init', 'Авторизация провалилась');
		});

		await querySys.faSend(`${this.req.auth.auth_url}`, reqData);
	}

	/**
	 * Получения доступа на контроллер
	 *
	 * @param string alias
	 * @return boolean
	 */
	public async isAccessCtrl(alias: string): Promise<boolean> {
		let ok = true;

		if (this.ctrlAccessList[alias]) { // Проверяем существование модуля
			this.errorSys.devNotice('ctrl_access_exist', `Модуль - ${alias} найден`);
			this.idCtrlAccess = this.ctrlAccessList[alias];
			this.aliasCtrlAccess = alias;
		} else {
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
				this.errorSys.error('get_access_crud', 'Не возможно получить CRUD права на контроллер');
			}
		}

		this.accessCRUDList = accessCRUDList;

		if (ifCtrlAccess) {
			this.errorSys.devNotice('ctrl_access', `Доступ к ${alias} получен`);
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

		if (!this.accessCRUDList) {
			ok = false;
			this.errorSys.error('crud_access_list', 'Нет списка прав');
		}

		if (ok) {
			if (this.accessCRUDList.create) {
				this.errorSys.devNotice('access_create', 'Проверка прав на create прошла успешно');
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

		if (!this.accessCRUDList) {
			ok = false;
			this.errorSys.error('crud_access_list', 'Нет списка прав');
		}

		if (ok) {
			if (this.accessCRUDList.read) {
				this.errorSys.devNotice('access_read', 'Проверка прав на read прошла успешно');
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

		if (!this.accessCRUDList) {
			ok = false;
			this.errorSys.error('crud_access_list', 'Нет списка прав');
		}

		if (ok) {
			if (this.accessCRUDList.update) {
				this.errorSys.devNotice('access_update', 'Проверка прав на update прошла успешно');
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

		if (!this.accessCRUDList) {
			ok = false;
			this.errorSys.error('crud_access_list', 'Нет списка прав');
		}

		if (ok) {
			if (this.accessCRUDList.delete) {
				this.errorSys.devNotice('access_delete', 'Проверка прав на delete прошла успешно');
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

		if (ok && this.userGroupsList[RolesT.organizers]) {
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
		return !!this.isAdmin();
	}

	/**
	 * Проверка является ли пользователь администратором
	 *
	 * @return boolean
	 */
	public isAdmin(): boolean {
		let ok = this.errorSys.isOk();

		if (ok && this.userGroupsList[RolesT.administrators]) {
			this.errorSys.devNotice('is_admin', 'Вы администратор');
		} else {
			ok = false;
			this.errorSys.error('is_admin', 'Вы не администратор');
		}

		return ok;
	}

	/**
	 * Проверка является ли пользователь модератором
	 *
	 * @return boolean
	 */
	public isModerator(): boolean {
		let ok = this.errorSys.isOk();

		if (ok && this.userGroupsList[RolesT.global_moderators]) {
			this.errorSys.devNotice('is_moderator', 'Вы модератор');
		} else {
			ok = false;
			this.errorSys.error('is_moderator', 'Вы не модератор');
		}

		return ok;
	}

	/**
	 * Проверка имеет ли пользователь доступ к ПВЗ
	 *
	 * @return boolean
	 */
	public isPvzUser(): boolean {
		let ok = this.errorSys.isOk();

		if (ok && this.userGroupsList[RolesT.pvz_users]) {
			this.errorSys.devNotice('is_pvz_user', 'Вы пользователь ПВЗ');
		} else {
			ok = false;
			this.errorSys.error('is_pvz_user', 'Вы не пользователь ПВЗ');
		}

		return ok;
	}

	/**
	 * Проверка является ли пользователь модератором ПВЗ
	 *
	 * @return boolean
	 */
	public isPvzModerator(): boolean {
		let ok = this.errorSys.isOk();

		if (ok && this.userGroupsList[RolesT.pvz_moderators]) {
			this.errorSys.devNotice('is_pvz_moderator', 'Вы модератор ПВЗ');
		} else {
			ok = false;
			this.errorSys.error('is_pvz_moderator', 'Вы не модератор ПВЗ');
		}

		return ok;
	}

	/**
	 * Проверка является ли пользователь авторизированным
	 *
	 * @return boolean
	 */
	public async isAuth(): Promise<boolean> {
		let ok = this.errorSys.isOk();

		if (ok && await this.userSQL.isAuth(this.apikey)) {
			this.errorSys.devNotice('is_auth', 'Вы авторизованы');
		} else {
			ok = false;
			this.errorSys.error('is_auth', 'Вы не авторизованы');
			this.errorSys.devNotice('is_auth', 'Вы не авторизованы');
		}

		return ok;
	}

	/**
	 * возвращает apikey
	 *
	 * @return string|null
	 */
	public fGetApikey(): string {
		return this.apikey;
	}

	/**
	 * Получить ID пользователя
	 */
	public getIdUser(): number {
		return this.idUser;
	}

	/**
	 * Получить рейтинг пользователя
	 */
	public getUserRating(): number {
		let iUserRating = 0;
		if (this.userInfo) {
			iUserRating = this.userInfo.consumer_rating;
		} else {
			iUserRating = 0;
		}
		return iUserRating;
	}

	/**
	 * Получить инфу о пользователе
	 */
	public getUserInfo(): UserInfoI {
		return this.userInfo;
	}

	/**
	 * Список ID групп в которых состоит пользователь
	 */
	public getUserGroupIds(): number[] {
		return !this.userGroupsList ? [] : Object.values(this.userGroupsList);
	}

	/**
	 * Проверяет состоит ли пользователь в группе
	 * @param groupAlias Алиас группы на принадлежность к которой нужно проверить пользователя
	 */
	public isUserInGroup(groupAlias: string): boolean {
		return !this.userGroupsList ? false : !!this.userGroupsList[groupAlias];
	}
}
