// Библиотеки
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import * as _ from 'lodash';

// Системные сервисы

// SQL Запросы
import { P63Context } from './P63Context';
import { RoleT } from '../Interfaces/RoleI';
import { OrgRoleT } from '../Interfaces/OrgRoleI';
import { GroupT } from '../Interfaces/GroupI';

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
	public init(param?: {
        vUser:UserInfoI; // Информация пользователя
        aGroup:GroupUserI[]; // Группы пользователя
        ixRole: Record<RoleT, boolean>;
        ixRoleRoute: Record<string, boolean>;
        ixOrgRole: Record<string | number, Record<OrgRoleT, boolean>>;
        ixOrgRoleRoute: Record<string | number, Record<string, boolean>>;
    }): void {
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

    // ==================================================
    // Проверки без выброса ошибок
    // ==================================================

	/**
	 * Проверка является ли пользователь организатором
	 */
	public isOrg(): boolean {
		return !!this.ixUserGroups[GroupT.organizers];
	}

	/**
	 * Проверка является ли пользователь администратором организаторов на пр Ольга Проданова
	 */
	public isOrgAdmin(): boolean {
		return this.isAdmin();
	}

	/**
	 * Проверка является ли пользователь администратором
	 */
	public isAdmin(): boolean {
		return !!this.ixUserGroups[GroupT.administrators];
	}

	/**
	 * Проверка является ли пользователь модератором
	 */
	public isModerator(): boolean {
		return !!this.ixUserGroups[GroupT.global_moderators];
	}

	/**
	 * Проверка имеет ли пользователь доступ к ПВЗ
	 */
	public isPvzUser(): boolean {
		return !!this.ixUserGroups[GroupT.pvz_users];
	}

	/**
	 * Проверка является ли пользователь модератором ПВЗ
	 */
	public isPvzModerator(): boolean {
		return !!this.ixUserGroups[GroupT.pvz_moderators];
	}

	/**
	 * Проверка является ли пользователь авторизированным
	 */
	public isAuth(): boolean {
		return !!this.idUser;
	}

    // ==================================================
    // Геттеры
    // ==================================================

	/**
	 * возвращает apikey
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
     * @todo вырезать из абстрактного класса UserSys
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
     * @todo вырезать из абстрактного класса UserSys
     */
     public getIxRole(): Record<RoleT, boolean> {
        return this.ixRole;
    }

    /**
     * Получить роли пользователя в организациях
     * @todo вырезать из абстрактного класса UserSys
     */
    public getIxOrgRole(): Record<string | number, Record<OrgRoleT, boolean>> {
        return this.ixOrgRole;
    }

    /**
     * Получить роуты, доступные по глобальным ролям
     * @todo вырезать из абстрактного класса UserSys
     */
    public getIxRoleRoute(): Record<string, boolean> {
        return this.ixRoleRoute;
    }

    /**
     * Получить роуты, доступные по ролям в организациях
     * @todo вырезать из абстрактного класса UserSys
     */
    public getIxOrgRoleRoute(): Record<string | number, Record<string, boolean>> {
        return this.ixOrgRoleRoute;
    }

    // ===================== Новая ролевая модель ================================

    /**
	 * Проверить, есть ли у пользователя конкретная роль
	 */
	public isRole(role: RoleT): boolean {
        return this.ixRole?.[role];
	}

	/**
	 * Проверить, есть ли у пользователя роль в конкретной или любой организаци
	 */
	public isRoleInOrganization(role: OrgRoleT, idOrg: number): boolean {
		return !!this.ixOrgRole?.[idOrg]?.[role];
	}


	/**
	 * Проверить, если доступ к роуту по глобальной роли
	 */
	public isAccessByRole(): boolean {
		const route = this.ctx.req.url;
		return !!this.ixRoleRoute?.[route];
	}

	/**
	 * Проверить, если доступ к роуту по орг роли
	 */
	public isAccessByOrgRole(idOrg: number): boolean {
		const route = this.ctx.req.url;

		return this.ixOrgRoleRoute?.[idOrg]?.[route];
	}

	/**
	 * Получить IDs организаций, в которых доступен данный роут
	 */
	public getAvailableOrganizationId(): number[] {
		const route = this.ctx.req.url;

		const aidOrganization =  Object.keys(this.ixOrgRoleRoute);
        const aidAccessOrganization = [];
		for (let i = 0; i < aidOrganization.length; i++) {
			const idOrg = Number(aidOrganization[i]);
			if(this.ixOrgRoleRoute?.[idOrg]?.[route]) {
				aidAccessOrganization.push(idOrg);
			}
		}

		return aidAccessOrganization;
	}
}
