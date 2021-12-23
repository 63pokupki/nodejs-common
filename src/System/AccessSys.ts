
import _ from 'lodash';
import { ErrorSys } from '@a-a-game-studio/aa-components';
import { P63Context } from './P63Context';
import { mJwtDecode } from '../Helpers/JwtH';
import { mDecrypt } from '../Helpers/CryptoH';
import { UserSys } from './UserSys';
import { RoleT } from '../Interfaces/RoleI';
import { OrgRoleT } from '../Interfaces/OrgRoleI';

/**  */
export class AccessSys {
	private ctx: P63Context;

	private errorSys: ErrorSys;

    private userSys: UserSys;

	private ixCtrl: Record<string, boolean>;

    /** Глобальные роли */
    private ixRole: Record<RoleT, boolean>;

    /** роуты, доступные по глобальным ролям */
    private ixRoleRoute: Record<string, boolean>;

    /** Роли в организациях */
    private ixOrgRole: Record<string | number, Record<OrgRoleT, boolean>>;

    /** роуты, доступные по ролям в организациях */
    private ixOrgRoleRoute: Record<string | number, Record<string, boolean>>;

	/**  */
	constructor(ctx: P63Context) {
		this.ctx = ctx;
		this.errorSys = ctx.sys.errorSys;
		this.userSys = ctx.sys.userSys;
        this.ixRole = this.userSys.getIxRole();
        this.ixOrgRole = this.userSys.getIxOrgRole();
        this.ixRoleRoute = this.userSys.getIxRoleRoute();
        this.ixOrgRoleRoute = this.userSys.getIxOrgRoleRoute();
	}

	// ========================================
	// Проверки с выбросом ошибок
	// ========================================

    /**
	 * Доступ только для группы администаторы
	 */
	public isAdmin(): void {
		if(!this.userSys.isAdmin()) {
            throw this.errorSys.throwAccess('Вы не администратор');
        } else {
            this.errorSys.devNotice('is_admin', 'Вы администратор');
        }
	}

    /**
	 * Доступ только для группы организаторы
	 */
	public isOrg(): void {
		if(!this.userSys.isOrg()) {
            throw this.errorSys.throwAccess('Вы не организатор');
        } else {
            this.errorSys.devNotice('is_org', 'Вы организатор');
        }
	}

    /**
	 * Доступ только для группы администаторы организаторов
	 */
	public isOrgAdmin(): void {
		if(!this.userSys.isOrgAdmin()) {
            throw this.errorSys.throwAccess('Вы не администратор организаторов');
        } else {
            this.errorSys.devNotice('is_org_admin', 'Вы администратор организаторов');
        }
	}

    /**
	 * Доступ только для группы модераторы
	 */
	public isModerator(): void {
		if(!this.userSys.isModerator()) {
            throw this.errorSys.throwAccess('Вы не модератор');
        } else {
            this.errorSys.devNotice('is_moderator', 'Вы модератор');
        }
	}

    /**
	 * Доступ только для группы пвз пользователи
	 */
	public isPvzUser(): void {
		if(!this.userSys.isPvzUser()) {
            throw this.errorSys.throwAccess('Вы не пользователь ПВЗ');
        } else {
            this.errorSys.devNotice('is_pvz_user', 'Вы пользователь ПВЗ');
        }
	}

    /**
	 * Доступ только для группы ПВЗ модераторы
	 */
	public isPvzModerator(): void {
		if(!this.userSys.isPvzModerator()) {
            throw this.errorSys.throwAccess('Вы не модератор ПВЗ');
        } else {
            this.errorSys.devNotice('is_pvz_moderator', 'Вы модератор ПВЗ');
        }
	}

    /**
	 * Доступ только для авторизованных пользователей
	 */
	public isAuth(): void {
		if(!this.userSys.isAuth()) {
            throw this.errorSys.throwAccess('Вы не авторизованы');
        } else {
            this.errorSys.devNotice('is_auth', 'Вы авторизованы');
        }
	}

	/**
	 * Доступ к роуту по роли
	 */
	public accessByRole(): void {
		const route = this.ctx.req.url;

		if (this.ixRoleRoute?.[route]) {
            this.errorSys.devNotice('access_by_role', 'Доступ к роуту по глобальной роли');
		} else {
			throw this.errorSys.throwAccess('У вас нет доступа к данному роуту по роли на сайте');
		}
	}

	/**
	 * Доступ к роуту по роли в организации
	 */
	public accessByOrgRole(orgId: number): void {
		const route = this.ctx.req.url;

		if (this.ixOrgRoleRoute?.[orgId]?.[route]) {
			this.errorSys.devNotice('access_by_orgrole', 'Доступ к роуту по роли в организации');
		} {
            throw this.errorSys.throwAccess('У вас нет доступа к данному роуту по роли в организации');
		}
	}

	/**
	 * Доступ к роуту по глобальной или роли в организации
	 */
	public accessByAnyRole(orgId: number): void {
		const route = this.ctx.req.url;

		const accessByRole = this.ixRoleRoute?.[route];
		let accessByOrgRole = this.ixOrgRoleRoute?.[orgId]?.[route];

		if(accessByRole) {
			this.errorSys.devNotice('access_by_role', 'Доступ к роуту по глобальной роли');
		}
		if(accessByOrgRole) {
			this.errorSys.devNotice('access_by_orgrole', 'Доступ к роуту по роли в организации');
		}

		if (!accessByRole && !accessByOrgRole) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному роуту по глобальной/орг роли');
		}
	}

	/**
	 * проверка доступа к контроллеру по группе
	 */
	public accessCtrl(ctrlName: string): void {
		if (!this.ixCtrl?.[ctrlName]) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному контроллеру');
		}
	}

	// ============================================
	// Проверки без выброса ошибок
	// ============================================

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
	public isAccessByOrgRole(): number[] {
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
	 * Проверка межсерверного запроса
	 */
	public accessSrv(): boolean {
        let bOk = true;

        if(!this.ctx.sys.srvkey || this.ctx.sys.srvkey?.length > 10000){ // Проверка наличия серверного ключа
            bOk = false;
        }
        if(bOk){ // Проверить IP
            bOk = this.ctx.srv.ipPool.includes(this.ctx.req.socket.remoteAddress);
        }

        let asSrvKeyInput:string[] = [];
        if(bOk && this.ctx.sys.srvkey){
            try{
                asSrvKeyInput = mJwtDecode<string[]>({
                    jwt:mDecrypt(
                        this.ctx.srv.cry.algorithm,
                        this.ctx.srv.cry.key,
                        this.ctx.sys.srvkey
                    ),
                    algorithm:this.ctx.srv.jwt.algorithm,
                    secret:this.ctx.srv.jwt.jwtKey
                });

            } catch(e){
                bOk = false;
                console.log('!!!ERROR!!!>>>', 'Не удалась расшифровать srvkey - ', this.ctx.req.socket.remoteAddress);
            }
        }
        
        if(bOk){ // проверяем ключи
            const asKeyValid = _.intersection(this.ctx.srv.keyPool, asSrvKeyInput)
            
            if(!asKeyValid || asKeyValid?.length < 5){
                bOk = false;
            }
        }

        this.ctx.sys.bSrv = false; // Проверка сервера
        if(bOk){
            this.ctx.sys.bSrv = true;
            this.ctx.sys.errorSys.devNotice('cross_srv', 'Межсерверный запрос');
        } else {
            this.ctx.sys.errorSys.error('cross_srv', 'Ошибка межсерверного запроса');
        }

        return bOk;
	}
}
