// Библиотеки
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import * as _ from 'lodash';

// Системные сервисы

// SQL Запросы
import { RolesT } from './RolesI';
import { P63Context } from './P63Context';
import { RoleT } from '../Interfaces/RoleI';
import { OrgRoleT } from '../Interfaces/OrgRoleI';

/** Информация по пользователю */
interface UserInfoI {
    user_id: number; // ID пользователя
    username: string; // Ник
    consumer_rating: number; // Рейтинг
}

/** Группы пользователей */
interface GroupUserI {
    group_id: number;
    alias: string;
}

/**
 * Класс который глобально знает все данные пользователя
 */
export class UserSys {
	public idUser = 0; // ID пользователя

	private apikey: string; // APIKEY

	private vUserInfo: UserInfoI; // Информация о пользователе

	private ixUserGroups: Record<string, number>; // Группы пользователя

	private ctx: P63Context; // Объект запроса пользователя

	private errorSys: ErrorSys;

    /** Глобальные роли */
    private ixRole: Record<RoleT, boolean>;

    /** роуты, доступные по глобальным ролям */
    private ixRoleRoute: Record<string, boolean>;

    /** Роли в организациях */
    private ixOrgRole: Record<string | number, Record<OrgRoleT, boolean>>;

    /** роуты, доступные по ролям в организациях */
    private ixOrgRoleRoute: Record<string | number, Record<string, boolean>>;

	public constructor(ctx: P63Context) {
		this.ctx = ctx;

		this.errorSys = ctx.sys.errorSys;

		this.ixUserGroups = {};

		/* вылавливаем apikey */

		this.apikey = ctx.apikey;

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
	public async init(param?: {
        vUser?:UserInfoI; // Информация пользователя
        aGroup?:GroupUserI[]; // Группы пользователя
        ixRole: Record<RoleT, boolean>;
        ixRoleRoute: Record<string, boolean>;
        ixOrgRole: Record<string | number, Record<OrgRoleT, boolean>>;
        ixOrgRoleRoute: Record<string | number, Record<string, boolean>>;
    }): Promise<void> {
		let ok = this.errorSys.isOk(); // По умолчанию true

		// Проверяем apikey

        let ifAuth = false;
        if(param?.vUser){
            ifAuth = true;
            this.idUser = param.vUser.user_id;
        }

		if (ifAuth) { // Ставим в общий слой видимости флаг авторизации
			this.ctx.sys.bAuth = true;
		}


		if (ok && ifAuth) { // Получаем информацию о пользователе по apikey
			this.vUserInfo = param.vUser;
		}

		if (ok && ifAuth && param?.aGroup) { // Проиндексировать группы по: имени группы
			for (let i = 0; i < param.aGroup.length; i++) {
                const vGroup = param.aGroup[i];

				this.ixUserGroups[vGroup.alias] = vGroup.group_id;
            }
		}
        
		if (ok && ifAuth) {
			this.ixRole = param.ixRole;
			this.ixOrgRole = param.ixOrgRole;
			this.ixRoleRoute = param.ixRoleRoute;
			this.ixOrgRoleRoute = param.ixOrgRoleRoute;
		}

		if (ok && ifAuth) { // Уведомление об успешной авторизации пользователя в DEV режиме
			this.errorSys.devNotice('is_user_init', `Авторизация прошла успешно, пользователь - ${this.vUserInfo?.username}`);
		} else {
			this.errorSys.devWarning('is_user_init', 'Авторизация провалилась');
		}
	}

	/**
	 * Проверка является ли пользователь организатором
	 *
	 * @return boolean
	 */
	public isOrg(): boolean {
		let ok = this.errorSys.isOk();

		if (ok && this.ixUserGroups[RolesT.organizers]) {
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

		if (ok && this.ixUserGroups[RolesT.administrators]) {
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

		if (ok && this.ixUserGroups[RolesT.global_moderators]) {
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

		if (ok && this.ixUserGroups[RolesT.pvz_users]) {
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

		if (ok && this.ixUserGroups[RolesT.pvz_moderators]) {
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
		if (this.vUserInfo) {
			iUserRating = this.vUserInfo.consumer_rating;
		} else {
			iUserRating = 0;
		}
		return iUserRating;
	}

	/**
	 * Получить инфу о пользователе
	 */
	public getUserInfo(): UserInfoI {
		return this.vUserInfo;
	}

	/**
	 * Список ID групп в которых состоит пользователь
	 */
	public getUserGroupIds(): number[] {
		return !this.ixUserGroups ? [] : Object.values(this.ixUserGroups);
	}

	/**
	 * Проверяет состоит ли пользователь в группе
	 * @param groupAlias Алиас группы на принадлежность к которой нужно проверить пользователя
	 */
	public isUserInGroup(groupAlias: string): boolean {
		return !this.ixUserGroups ? false : !!this.ixUserGroups[groupAlias];
	}


    /**
     * Получить глобальные роли пользователя
     */
     public getIxRole(): Record<RoleT, boolean> {
        return this.ixRole;
    }

    /**
     * Получить роли пользователя в организациях
     */
    public getIxOrgRole(): Record<string | number, Record<OrgRoleT, boolean>> {
        return this.ixOrgRole;
    }

    /**
     * Получить роуты, доступные по глобальным ролям
     */
    public getIxRoleRoute(): Record<string, boolean> {
        return this.ixRoleRoute;
    }

    /**
     * Получить роуты, доступные по ролям в организациях
     */
    public getIxOrgRoleRoute(): Record<string | number, Record<string, boolean>> {
        return this.ixOrgRoleRoute;
    }
}
