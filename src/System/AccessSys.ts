import { MainRequest } from './MainRequest';
import { UserSys } from './UserSys';
import { RoleModelSQL } from '../Infrastructure/SQL/Repository/RoleModelSQL';
import _ from 'lodash';
import { ErrorSys } from '@a-a-game-studio/aa-components';

/**  */
export class AccessSys {
	req: MainRequest;

	roleModelSQL: RoleModelSQL;

	errorSys: ErrorSys;

	private routesByRole: Record<string, boolean>;

	private userId: number;

	private ctrls: Record<string, boolean>;

	private routesByOrgrole: Record<string | number, Record<string, boolean>>;

	/**  */
	constructor(req: MainRequest) {
		this.req = req;
		this.errorSys = req.sys.errorSys;
		this.userId = req.sys.userSys.idUser;
		this.roleModelSQL = new RoleModelSQL(req);
	}

	/**
	 * сохранение массива доступных роутов по роли
	 */
	private async faGetRoleRoutes(): Promise<void> {
		// массив ролей пользователя
		const routesByRole = await this.roleModelSQL.listRoutesForRoleByUserId(this.userId);

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
	 * получение массива доступных роутов по оргроли + редис
	 */
	private async faGetOrgroleRoutes(): Promise<void> {
		const routesByOrgrole = await this.roleModelSQL.listRoutesForOrgroleByUserId(this.userId);
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
	private async faGetGroupRoutes(): Promise<void> {
		const ctrls = await this.roleModelSQL.getCtrlsByUserId(this.userId);

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
		await this.faGetRoleRoutes();

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

		await this.faGetOrgroleRoutes();

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
		await this.faGetGroupRoutes();

		if (!this.ctrls[ctrlName]) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному контроллеру');
		}
	}
}
