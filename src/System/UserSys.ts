// Библиотеки
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';

// Системные сервисы
import { RolesT } from './RolesI';
import { AuthR, UserInfoI } from '../Interface/AuthUser';
import { AuthQuerySys } from '../Common/AuthQuerySys';
import { P63Context } from './P63Context';


/**
 * Класс который глобально знает все данные пользователя
 */
export class UserSys {
	public idUser = 0; // ID пользователя

	private apikey: string; // APIKEY

	private userInfo: UserInfoI; // Информация о пользователе

	private userGroupsList: Record<string, number>; // Роли пользователя

	private ctrlAccessList: Record<string, number>; // Список модулей

	private ctx: P63Context; // Объект запроса пользователя

	private errorSys: ErrorSys;

	private readonly authQuerySys: AuthQuerySys;

	public constructor(ctx: P63Context) {
		this.ctx = ctx;
		this.errorSys = ctx.sys.errorSys;
		this.ctrlAccessList = {};
		this.userGroupsList = {};
		this.authQuerySys = ctx.sys.authQuerySys;
		/**
		 * Вылавливаем апикей
		 * Костыль с String т.к. 1) в ноде headers.apikey имеет тип string | string [], поэтому юзаем String
		 * 2) Перед этим проверяем, потому чтоесли undefined, то получается строка 'undefined'
		 */
		this.apikey = ctx.cookies.apikey || ctx.headers.apikey ? String(ctx.headers.apikey) : '' ;

		if (!this.apikey) {
			this.apikey = '';
			this.errorSys.devWarning('apikey', 'apikey - пустой');
		}
	}

	/**
	 * Инициализация данных пользователя
	 */
	public async init(): Promise<void> {
		this.authQuerySys.fInit();
		
		const reqData: AuthR.authByApikey.RequestI = {
			apikey: this.apikey,
		};

		// Запрос к сервису авторизации
		this.authQuerySys.fActionOk((data: AuthR.authByApikey.ResponseI)=> {
			console.log('==========================');
			console.log('fActionOk response :>> ', data);
			console.log('==========================');
			if (data.user_info) {
				if (this.ctx.common.env !== 'prod') {
					console.log(`Авторизация через Auth.Core прошла успешно, пользователь - ${data.user_info.username}`);
				}
				
				this.ctx.sys.errorSys.devNotice(
					'is_user_init', `Авторизация через Auth.Core прошла успешно, пользователь - ${data.user_info.username}`,
				);
				// Заносим доступные user id, групп и контроллеры
				this.setUserInfo({
					idUser: data.user_info.user_id,
					aCtrlName: data.list_ctrl,
					aGroup: data.list_group,
				});
			} else {
				this.errorSys.devWarning('is_user_init', 'Авторизация провалилась');
			}
			
		});
		this.authQuerySys.fActionErr((e: Record<string, string>) => {
			// TODO: отправка в мм и систему ошибок в core
			this.errorSys.devWarning('is_user_init', 'Ошибка авторизации');
		});

		// если есть апикей, то пытаемся авторизовать пользователя
		if (this.apikey) {
			console.log('стучимся в ауфкор :>> ');
			await this.authQuerySys.faSend(AuthR.authByApikey.route, reqData);
		} else {
			this.errorSys.devWarning('is_user_init', 'Пользователь не авторизован');
		}
	}

	/**
	 * Сохранить ID пользователя, доступные ему группы и контроллеры
	 */
	public setUserInfo(data: {
		idUser: number,
		aGroup: {
			group_id: number;
			group_name: string;
			group_alias: string;
		}[],
		aCtrlName: {
			/** Id контроллера */
			ctrl_id: number;
			/** Псевдоним пользователя */
			ctrl_alias: string;
		}[],
	}): void {
		this.idUser = data.idUser;
		this.ctx.sys.bAuth = true;
		
		// сохраняем группы пользователя
		for (let i = 0; i < data.aGroup.length; i++) {
			const group = data.aGroup[i];
			this.userGroupsList[group.group_alias] = group.group_id;
		}

		// сохраняем доступные пользователю контроллеры
		for (let i = 0; i < data.aCtrlName.length; i++) {
			const ctrl = data.aCtrlName[i];
			this.ctrlAccessList[ctrl.ctrl_alias] = ctrl.ctrl_id;
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
