// Библиотеки
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';

// Системные сервисы
import { MainRequest } from './MainRequest';
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

	private userGroupsList: Record<string, number>; // Роли пользователя

	private ctrlAccessList: Record<string, number>; // Список модулей

	private req: MainRequest; // Объект запроса пользователя

	private errorSys: ErrorSys;

	public constructor(req: MainRequest) {
		this.req = req;
		this.errorSys = req.sys.errorSys;
		this.ctrlAccessList = {};
		this.userGroupsList = {};

		/* вылавливаем apikey */
		this.apikey = req.cookies.apikey || req.headers.apikey;

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
					'is_user_init', `Авторизация через Auth.Core прошла успешно, пользователь - ${data.user_info.username}`
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
				this.errorSys.devWarning('is_user_init', 'Авторизация провалилась');
			}
			
		});
		querySys.fActionErr((e: Record<string, string>) => {
			// TODO: отправка в мм и систему ошибок в core
			this.errorSys.devWarning('is_user_init', 'Ошибка авторизации');
		});

		if (this.apikey) {
			await querySys.faSend(`${this.req.auth.auth_url}`, reqData);
		} else {
			this.errorSys.devWarning('is_user_init', 'Пользователь не авторизован');
		}
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
	 * @maybe добавить throw
	 */
	public isAuth(): boolean {
		let ok = this.errorSys.isOk();

		if (ok && this.idUser) {
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
