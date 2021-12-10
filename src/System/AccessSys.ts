import _ from 'lodash';
import { ErrorSys } from '@a-a-game-studio/aa-components';
import { AuthR } from '../Interface/AuthUser';
import { AuthQuerySys } from '../Common/AuthQuerySys';
import { P63Context } from './P63Context';

/**  */
export class AccessSys {
	private ctx: P63Context;

	errorSys: ErrorSys;

	private aRouteByRole: Record<string, boolean> = {};

	private idUser: number;

	private aCtrl: Record<string, boolean> = {};

	private aRouteByOrgRole: Record<string | number, Record<string, boolean>> = {};

	private readonly authQuerySys: AuthQuerySys;

	/**  */
	constructor(ctx: P63Context) {
		this.ctx = ctx;
		this.errorSys = ctx.sys.errorSys;
		this.idUser = ctx.sys.userSys.idUser;
		this.authQuerySys = ctx.sys.authQuerySys;
	}

	/**
	 * Получить роуты, доступные по роли
	 */
	private async faListRouteForRole(): Promise<void> {
		this.authQuerySys.fInit();
		this.authQuerySys.fAction((data: AuthR.getListRouteByRole.ResponseI)=> {
			for (let i = 0; i < data.list_route_url.length; i++) {
				const route = data.list_route_url[i];
				this.aRouteByRole[route] = true;
			}
			this.ctx.sys.errorSys.devNotice('access_by_roles', 'Доступые по ролям роуты получены из auth.core');
		});

		this.authQuerySys.fActionErr(() => {
			this.errorSys.error('AccessSys.faListRouteForRole', 'Не удалось получить доступные по ролям роуты');
		});

		const reqData:  AuthR.getListRouteByRole.RequestI = {
			user_id: this.idUser,
		};

		await this.authQuerySys.faSend(`${this.ctx.auth.auth_url}/${AuthR.getListRouteByRole.route}`, reqData);
	}

	/**
	 * Получить роуты, доступные по оргроли
	 */
	private async faListRouteForOrgrole(): Promise<void> {
		this.authQuerySys.fInit();
		this.authQuerySys.fAction((data: AuthR.getListRouteByOrgRole.ResponseI)=> {
			for (let i = 0; i < data.list_org_route.length; i++) {
				const orgRole = data.list_org_route[i];
				this.aRouteByOrgRole[orgRole.org_id][orgRole.route_url] = true;
			}
			this.ctx.sys.errorSys.devNotice('access_by_orgroles', 'Доступые по оргролям роуты полоучены из auth.core');
		});

		this.authQuerySys.fActionErr(() => {
			this.errorSys.error('AccessSys.faListRouteForOrgrole', 'Не удалось получить доступные по оргролям роуты');
		});

		const reqData:  AuthR.getListRouteByOrgRole.RequestI = {
			user_id: this.idUser,
		};

		await this.authQuerySys.faSend(`${this.ctx.auth.auth_url}/${AuthR.getListRouteByOrgRole.route}`, reqData);
	}

	/**
	 * получение массива доступных контроллеров по группе
	 */
	private async faListCtrlByGroup(): Promise<void> {
		this.authQuerySys.fInit();
		this.authQuerySys.fAction((data: AuthR.getListCtrl.ResponseI)=> {
			for (let i = 0; i < data.list_ctrl_alias.length; i++) {
				const ctrlAlias = data.list_ctrl_alias[i];
				this.aCtrl[ctrlAlias] = true;
			}
			this.ctx.sys.errorSys.devNotice('access_by_groups', 'Доступые контроллеры получены из auth.core');
		});

		this.authQuerySys.fActionErr(() => {
			this.errorSys.error('AccessSys.faListCtrlByGroup', 'Не удалось получить доступные контроллеры');
		});

		const reqData:  AuthR.getListCtrl.RequestI = {
			user_id: this.idUser,
		};

		await this.authQuerySys.faSend(`${this.ctx.auth.auth_url}/${AuthR.getListCtrl.route}`, reqData);
	}

	// ========================================
	// Проверки с выбросом ошибок
	// ========================================

	/**
	 * проверка доступа к роуту по роли
	 * (обратная совместимость)
	 */
	public async accessAction(): Promise<void> {
		await this.accessByRole();
	}
	
	/**
	 * проверка доступа к роуту по оргроли
	 * (обратная совместимость)
	 */
	public async accessActionOrg(orgId: number): Promise<void> {
		await this.accessByOrgRole(orgId);
	}


	/**
	 * проверка доступа к роуту по роли
	 */
	public async accessByRole(): Promise<void> {
		await this.faListRouteForRole();

		const route = this.ctx.req.url;

		if (!this.aRouteByRole[route]) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному роуту по роли на сайте');
		} else {
			this.errorSys.devNotice('access_by_role', 'Доступ к роуту по глобальной роли');
		}
	}

	/**
	 * проверка доступа к роуту по оргроли
	 */
	public async accessByOrgRole(orgId: number): Promise<void> {
		let res: boolean;

		await this.faListRouteForOrgrole();

		const route = this.ctx.req.url;

		try {
			res = this.aRouteByOrgRole[orgId][route];
		} catch (e) {
			res = null;
		}

		if (!res) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному роуту по роли в организации');
		} {
			this.errorSys.devNotice('access_by_orgrole', 'Доступ к роуту по роли в организации');
		}
	}

	/**
	 * Проверка доступа к роуту по глобальной или орг роли
	 */
	public async accessByAnyRole(orgId: number): Promise<void> {
		await this.faListRouteForRole();
		await this.faListRouteForOrgrole();

		const route = this.ctx.req.url;

		const accessByRole = this.aRouteByRole[route];
		let accessByOrgRole = false;
		try {
			accessByOrgRole = this.aRouteByOrgRole[orgId][route];
		} catch (e) {}

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
	 * @param ctrlName
	 */
	public async accessCtrl(ctrlName: string): Promise<void> {
		await this.faListCtrlByGroup();

		if (!this.aCtrl[ctrlName]) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному контроллеру');
		}
	}

	// ============================================
	// Проверки без выброса ошибок
	// ============================================

	/**
	 * Проверить, если доступ к роуту по глобальной роли
	 */
	public async isAccessByRole(): Promise<boolean> {
		await this.faListRouteForRole();
		const route = this.ctx.req.url;
		return this.aRouteByRole[route];
	}

	/**
	 * Проверить, если доступ к роуту по орг роли
	 * @returns IDs организаций, по которым есть доступ
	 */
	public async isAccessByOrgRole(): Promise<number[]> {
		await this.faListRouteForOrgrole();
		const route = this.ctx.req.url;

		const aidOrganization = [];
		for (let i = 0; i < Object.keys(this.aRouteByOrgRole).length; i++) {
			const idOrg = Number(Object.keys(this.aRouteByOrgRole)[i]);
			if(this.aRouteByOrgRole[idOrg][route]) {
				aidOrganization.push(idOrg);
			}
		}

		return aidOrganization;
	}
}
