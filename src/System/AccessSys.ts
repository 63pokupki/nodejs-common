
import { RoleModelSQL } from '../Infrastructure/SQL/Repository/RoleModelSQL';
import _ from 'lodash';
import { ErrorSys } from '@a-a-game-studio/aa-components';
import { RouteI } from '../Infrastructure/SQL/Entity/RouteE';
import { P63Context } from './P63Context';

/**  */
export class AccessSys {
	ctx: P63Context;

	roleModelSQL: RoleModelSQL;

	errorSys: ErrorSys;

	private routesByRole: Record<string, boolean>;

	private idUser: number;

	private ctrls: Record<string, boolean>;

	private routesByOrgrole: Record<string | number, Record<string, boolean>>;

	/**  */
	constructor(ctx: P63Context) {
		this.ctx = ctx;
		this.errorSys = ctx.sys.errorSys;
		this.idUser = ctx.sys.userSys.idUser;
		this.roleModelSQL = new RoleModelSQL(ctx);
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
		const aUserOrgrole = await this.roleModelSQL.listOrgRoleByUserId(this.idUser);

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
		const aRouteByOrgrole: { idOrg: number; name: string; url: string}[] = [];
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
	 * проверка доступа к роуту по роли
	 */
	public async accessAction(): Promise<void> {
		await this.faListRouteForRole();

		const route = this.ctx.req.url;

		if (!this.routesByRole[route]) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному роуту по роли на сайте');
		}
	}

	/**
	 * проверка доступа к роуту по оргроли
	 * @param orgId
	 */
	public async accessActionOrg(orgId: number): Promise<void> {
		let res: boolean;

		await this.faListRouteForOrgrole();

		const route = this.ctx.req.url;

		try {
			res = this.routesByOrgrole[orgId][route];
		} catch (e) {
			res = null;
		}

		if (!res) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному роуту по роли в организации');
		}
	}

	/**
	 * проверка доступа к контроллеру по группе
	 * @param ctrlName
	 */
	public async accessCtrl(ctrlName: string): Promise<void> {
		await this.faListCtrlByGroup();

		if (!this.ctrls[ctrlName]) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному контроллеру');
		}
	}
}
