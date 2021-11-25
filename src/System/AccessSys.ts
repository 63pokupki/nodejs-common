import { MainRequest } from './MainRequest';
import _ from 'lodash';
import { ErrorSys } from '@a-a-game-studio/aa-components';
import { QuerySys } from '@a-a-game-studio/aa-front';
import { AuthR } from '../Interface/AuthUser';
import { AuthQuerySys } from '../Common/AuthQuerySys';

/**  */
export class AccessSys {
	req: MainRequest;

	errorSys: ErrorSys;

	private aRouteByRole: Record<string, boolean> = {};

	private idUser: number;

	private aCtrl: Record<string, boolean> = {};

	private aRouteByOrgRole: Record<string | number, Record<string, boolean>> = {};

	private readonly authQuerySys: AuthQuerySys;

	/**  */
	constructor(req: MainRequest) {
		this.req = req;
		this.errorSys = req.sys.errorSys;
		this.idUser = req.sys.userSys.idUser;
		this.authQuerySys = new AuthQuerySys(req.auth.auth_url);
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
			this.req.sys.errorSys.devNotice('access_by_roles', 'Доступые по ролям роуты получены из auth.core');
		});

		this.authQuerySys.fActionErr(() => {
			this.errorSys.error('AccessSys.faListRouteForRole', 'Не удалось получить доступные по ролям роуты');
		});

		const reqData:  AuthR.getListRouteByRole.RequestI = {
			user_id: this.idUser,
		};

		await this.authQuerySys.faSend(`${this.req.auth.auth_url}/${AuthR.getListRouteByRole.route}`, reqData);
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
			this.req.sys.errorSys.devNotice('access_by_orgroles', 'Доступые по оргролям роуты полоучены из auth.core');
		});

		this.authQuerySys.fActionErr(() => {
			this.errorSys.error('AccessSys.faListRouteForOrgrole', 'Не удалось получить доступные по оргролям роуты');
		});

		const reqData:  AuthR.getListRouteByOrgRole.RequestI = {
			user_id: this.idUser,
		};

		await this.authQuerySys.faSend(`${this.req.auth.auth_url}/${AuthR.getListRouteByOrgRole.route}`, reqData);
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
			this.req.sys.errorSys.devNotice('access_by_groups', 'Доступые контроллеры получены из auth.core');
		});

		this.authQuerySys.fActionErr(() => {
			this.errorSys.error('AccessSys.faListCtrlByGroup', 'Не удалось получить доступные контроллеры');
		});

		const reqData:  AuthR.getListCtrl.RequestI = {
			user_id: this.idUser,
		};

		await this.authQuerySys.faSend(`${this.req.auth.auth_url}/${AuthR.getListCtrl.route}`, reqData);
	}

	/**
	 * проверка доступа к роуту по роли
	 */
	public async accessAction(): Promise<void> {
		await this.faListRouteForRole();

		const route = this.req.path;

		if (!this.aRouteByRole[route]) {
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
			res = this.aRouteByOrgRole[orgId][route];
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

		if (!this.aCtrl[ctrlName]) {
			throw this.errorSys.throwAccess('У вас нет доступа к данному контроллеру');
		}
	}
}
