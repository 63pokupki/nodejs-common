import { MainRequest } from './MainRequest';
import { RoleModelSQL } from '../Infrastructure/SQL/Repository/RoleModelSQL';
import _ from 'lodash';
import { ErrorSys } from '@a-a-game-studio/aa-components';
import { RouteI } from '../Infrastructure/SQL/Entity/RouteE';

/**  */
export class AccessSys {
	req: MainRequest;

	roleModelSQL: RoleModelSQL;

	errorSys: ErrorSys;

	private routesByRole: Record<string, boolean>;

	private idUser: number;

	private ctrls: Record<string, boolean>;

	private routesByOrgrole: Record<string | number, Record<string, boolean>>;

	/**  */
	constructor(req: MainRequest) {
		this.req = req;
		this.errorSys = req.sys.errorSys;
		this.idUser = req.sys.userSys.idUser;
		this.roleModelSQL = new RoleModelSQL(req);
	}

	/**
	 * сохранение массива доступных роутов по роли
	 */
	private async faListRouteForRole(): Promise<void> {
		// массив ролей пользователя
		const routesByRole = await this.roleModelSQL.listRouteForRoleByUserId(this.idUser);

		const sortedRoutes: Record<string, boolean> = {};
		if (routesByRole && routesByRole.length) {
			for (let i = 0; i < routesByRole.length; i++) {
				if (routesByRole[i].url) {
					sortedRoutes[routesByRole[i].url] = true;
				}
			}
		}
		this.routesByRole = sortedRoutes;
	}

	/**
	 * сохранение массива доступных роутов по роли
	 */
	private async faListRouteForRole2(): Promise<void> {
		/** IDs ролей */
		const aIdRole = await this.roleModelSQL.listRoleIdByUserId(this.idUser);

		/** IDs доступных роутгрупп */
		let aidRouteGroup: number[] = [];
		await Promise.all(aIdRole.map(async (idRole) => {
			const res = await this.roleModelSQL.listRouteGroupIdByRoleId(idRole);
			aidRouteGroup.push(...res);
		}));
		aidRouteGroup = _.uniq(aidRouteGroup);

		/** */
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
	 * получение массива доступных роутов по оргроли + редис
	 */
	private async faListRouteForOrgrole(): Promise<void> {
		const routesByOrgrole = await this.roleModelSQL.listRouteForOrgroleByUserId(this.idUser);
		const grouproutesByOrgrole = _.groupBy(routesByOrgrole, 'org_id');

		const sortedroutesByOrgrole: Record<string | number, Record<string, boolean>> = {};
		for (const key in grouproutesByOrgrole) {
			sortedroutesByOrgrole[key] = {};
			if(grouproutesByOrgrole[key].length) {
				const oneGroupOfRoutes = grouproutesByOrgrole[key];
				for (let i = 0; i < oneGroupOfRoutes.length; i++) {	
					sortedroutesByOrgrole[key][oneGroupOfRoutes[i].url] = true;
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

		const route = this.req.path;

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

		const route = this.req.path;

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
