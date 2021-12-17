
import { RoleModelSQL } from '../Infrastructure/SQL/Repository/RoleModelSQL';
import _ from 'lodash';
import { ErrorSys } from '@a-a-game-studio/aa-components';
import { RouteI } from '../Infrastructure/SQL/Entity/RouteE';
import { P63Context } from './P63Context';
import { RoleT } from '../Infrastructure/SQL/Entity/RoleE';
import { OrgRoleT } from '../Infrastructure/SQL/Entity/OrgRoleE';

/**  */
export class AccessSys {
	private ctx: P63Context;

	private roleModelSQL: RoleModelSQL;

	errorSys: ErrorSys;

	private routesByRole: Record<string, boolean>;

	private idUser: number;

	private ctrls: Record<string, boolean>;

	private routesByOrgrole: Record<string | number, Record<string, boolean>>;

	private aRole: RoleT[];

	private aOrgRole: Record< string| number, OrgRoleT[]>;

	/**  */
	constructor(ctx: P63Context) {
		this.ctx = ctx;
		this.errorSys = ctx.sys.errorSys;
		this.idUser = ctx.sys.userSys.idUser;
		this.roleModelSQL = new RoleModelSQL(ctx);
	}

	/**
	 * Получение информации о пользователе
	 */
	public async faInit(): Promise<void> {
		await Promise.all([
			this.faListRouteForRole(),
			this.faListRouteForOrgrole(),
			this.faListCtrlByGroup(),
			this.faListUserRole(),
			this.faListUserOrgRole(),
		]);
	}

	/**
	 * Получить роуты, доступные по роли
	 */
	private async faListRouteForRole(): Promise<void> {
		/** IDs ролей */
		const aidRole = await this.roleModelSQL.listRoleIdByUserId(this.idUser);

		/** IDs доступных роутгрупп */
		let aidRouteGroup: number[] = [];
		await Promise.all(aidRole.map(async (idRole) => {
			const res = await this.roleModelSQL.listRouteGroupIdByRoleId(idRole);
			aidRouteGroup.push(...res);
		}));
		aidRouteGroup = _.uniq(aidRouteGroup);

		/** Доступные роуты */
		let aRoute: RouteI[] = [];
		await Promise.all(aidRouteGroup.map(async (idRouteGroup) => {
			const res = await this.roleModelSQL.listRouteByRouteGroupId(idRouteGroup);
			aRoute.push(...res);
		}));

		aRoute = _.uniq(aRoute);

		const sortedRoutes: Record<string, boolean> = {};
		if (aRoute && aRoute.length) {
			for (let i = 0; i < aRoute.length; i++) {
				if (aRoute[i].url) {
					sortedRoutes[aRoute[i].url] = true;
				}
			}
		}
		this.routesByRole = sortedRoutes;
	}

	/**
	 * Получить роуты, доступные по оргроли
	 */
	private async faListRouteForOrgrole(): Promise<void> {
		const aUserOrgrole = await this.roleModelSQL.listOrgRoleIdByUserId(this.idUser);

		/** Роутгруппы, доступные в рамках организаций */
		const aRouteGroupInOrg: { idOrg: number; idRouteGroup: number }[] = [];
		await Promise.all(aUserOrgrole.map(async (userOrgole) => {
			const aidRouteGroup = await this.roleModelSQL.listRouteGroupIdByOrgoleId(userOrgole.orgrole_id);
			for (let i = 0; i < aidRouteGroup.length; i++) {
				const idRouteGroup = aidRouteGroup[i];
				aRouteGroupInOrg.push({
					idOrg: userOrgole.org_id,
					idRouteGroup,
				});
			}
		}));

		/** Роуты, доступные в рамках организаций */
		const aRouteByOrgrole: { idOrg: number; name: string; url: string }[] = [];
		await Promise.all(aRouteGroupInOrg.map(async (routeGroupInOrg) => {
			const aRoute = await this.roleModelSQL.listRouteByRouteGroupId(routeGroupInOrg.idRouteGroup);
			for (let i = 0; i < aRoute.length; i++) {
				const route = aRoute[i];
				aRouteByOrgrole.push({
					idOrg: routeGroupInOrg.idOrg,
					name: route.name,
					url: route.url,
				});
			}
		}));

		/** Роуты, доступные в рамках организаций, сгруппированные по организациям */
		const aGroupedRouteInOrg = _.groupBy(aRouteByOrgrole, 'idOrg');

		const sortedroutesByOrgrole: Record<string, Record<string, boolean>> = {};

		for (const idOrg of Object.keys(aGroupedRouteInOrg)) {
			sortedroutesByOrgrole[idOrg] = {};
			if (aGroupedRouteInOrg[idOrg].length > 0) {
				/** роуты, доступнын в рамках одной организации */
				const aRoute = aGroupedRouteInOrg[idOrg];
				for (let i = 0; i < aRoute.length; i++) {
					sortedroutesByOrgrole[idOrg][aRoute[i].url] = true;
				}
			}
		}

		this.routesByOrgrole = sortedroutesByOrgrole;


	}

	/**
	 * получение массива доступных контроллеров по группе
	 */
	private async faListCtrlByGroup(): Promise<void> {
		const ctrls = await this.roleModelSQL.listCtrlByUserId(this.idUser);

		const sortedCtrls: Record<string, boolean> = {};

		if (ctrls && ctrls.length) {
			for (let i = 0; i < ctrls.length; i++) {
				if (ctrls[i].alias) {
					sortedCtrls[ctrls[i].alias] = true;
				}
			}
		}

		this.ctrls = sortedCtrls;
	}

	/**
	 * Получить список ролей пользователя
	 */
	private async faListUserRole(): Promise<void> {
		if(!this.aRole) {
			this.aRole = await this.roleModelSQL.listRoleByUserId(this.idUser);
		}
	}

	/**
	 * Получить список ролей пользователя в организациях
	 */
	private async faListUserOrgRole(): Promise<void> {
		if(!this.aOrgRole) {
			this.aOrgRole = {};
			const aUserOrgRole = await this.roleModelSQL.listOrgRoleByUserId(this.idUser);
			for (let i = 0; i < aUserOrgRole.length; i++) {
				const userOrgRole = aUserOrgRole[i];

				// добавляем орг роль в список ролей в конкретной организации
				if(this.aOrgRole[userOrgRole.orgrole_id]?.length > 0) {
					this.aOrgRole[userOrgRole.orgrole_id].push(userOrgRole.alias);
				} else {
					this.aOrgRole[userOrgRole.orgrole_id] = [userOrgRole.alias];
				}
			}
		}
	}

	// ========================================
	// Проверки с выбросом ошибок
	// ========================================

	/**
	 * проверка доступа к роуту по роли
	 * (обратная совместимость)
	 */
	public  accessAction(): void {
		this.accessByRole();
	}
	
	/**
	 * проверка доступа к роуту по оргроли
	 * (обратная совместимость)
	 */
	public accessActionOrg(orgId: number): void {
		this.accessByOrgRole(orgId);
	}


	/**
	 * проверка доступа к роуту по роли
	 */
	public accessByRole(): void {
		const route = this.ctx.req.url;

		if (!this.routesByRole[route]) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному роуту по роли на сайте');
		} else {
			this.errorSys.devNotice('access_by_role', 'Доступ к роуту по глобальной роли');
		}
	}

	/**
	 * проверка доступа к роуту по оргроли
	 */
	public accessByOrgRole(orgId: number): void {
		let res: boolean;

		const route = this.ctx.req.url;

		try {
			res = this.routesByOrgrole[orgId][route];
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
	public accessByAnyRole(orgId: number): void {
		const route = this.ctx.req.url;

		const accessByRole = this.routesByRole[route];
		let accessByOrgRole = false;
		try {
			accessByOrgRole = this.routesByOrgrole[orgId][route];
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
	 */
	public accessCtrl(ctrlName: string): void {
		if (!this.ctrls[ctrlName]) {
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
		return this.routesByRole[route];
	}

	/**
	 * Проверить, если доступ к роуту по орг роли
	 * @returns IDs организаций, по которым есть доступ
	 */
	public isAccessByOrgRole(): number[] {
		const route = this.ctx.req.url;

		const aidOrganization = [];
		for (let i = 0; i < Object.keys(this.routesByOrgrole).length; i++) {
			const idOrg = Number(Object.keys(this.routesByOrgrole)[i]);
			if(this.routesByOrgrole[idOrg][route]) {
				aidOrganization.push(idOrg);
			}
		}

		return aidOrganization;
	}

	/**
	 * Проверить, есть ли у пользователя конкретная роль
	 */
	public isRole(role: RoleT): boolean {
		return this.aRole.includes(role);
	}

	/**
	 * Проверить, есть ли у пользователя роль в конкретной или любой организаци
	 */
	public isRoleInOrganization(role: OrgRoleT, idOrg: number): boolean {
		let res = false;
		// если пришел ID организации, то ищем в ней
		if(idOrg) {
			res = this.aOrgRole[idOrg]?.includes(role);
		}
		return res;
	}
}
