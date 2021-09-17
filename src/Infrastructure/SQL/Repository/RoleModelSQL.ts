import BaseSQL from '../../../System/BaseSQL';
import { RouteE, RouteI } from '../Entity/RouteE';
import { RouteOfRouteGroupE, RouteOfRouteGroupI } from '../Entity/RouteOfRouteGroupE';
import { UserGroupE } from '../Entity/UserGroupE';
import { UserRoleE, RouteOfUserI, UserRoleI } from '../Entity/UserRoleE';
import { UserOrgroleE, OrgRouteOfUserI } from '../Entity/UserOrgroleE';
import { OrgroleOfRouteGroupE } from '../Entity/OrgroleOfRouteGroupE';
import { RoleOfRouteGroupE, RoleOfRouteGroupI } from '../Entity/RoleOfRouteGroupE';
import { AccessGroupE } from '../Entity/AccessGroupE';
import { CtrlAccessE, CtrlAccessI } from '../Entity/CtrlAccessE';

export class RoleModelSQL extends BaseSQL {
	/**
	 * получить роуты пользователя по роли на сайте
	 * @param userId
	 */
	public async listRouteForRoleByUserId(idUser: number): Promise<RouteOfUserI[]> {
		let resp: RouteOfUserI[] = null;
		const sKeyCahce = `RoleModelExSQL.listRoutesForRoleByUserId(${idUser})`;
		resp = await this.autoCache(sKeyCahce, 3600, async () => {
			try {
				resp = await this.db({ ur: UserRoleE.NAME })
					.select('r.name', 'r.url')
					.leftJoin({ rlrg: RoleOfRouteGroupE.NAME }, 'ur.role_id', 'rlrg.role_id')
					.leftJoin({ rrg: RouteOfRouteGroupE.NAME }, 'rlrg.route_group_id', 'rrg.route_group_id')
					.leftJoin({ r: RouteE.NAME }, 'rrg.route_id', 'r.id')
					.where('ur.user_id', idUser);
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelExSQL.listRouteForRoleByUserId',
					'Не удалось получить роли пользователя по сайту'
				);
			}

			return resp;
		});
		return resp;
	}

	/**
	 * получить роуты пользователя по роли в организациях
	 * @param userId
	 */
	public async listRouteForOrgroleByUserId(idUser: number): Promise<OrgRouteOfUserI[]> {
		let resp: OrgRouteOfUserI[] = null;
		const sKeyCahce = `RoleModelExSQL.listRoutesForOrgroleByUserId(${idUser})`;
		resp = await this.autoCache(sKeyCahce, 3600, async () => {
			try {
				resp = await this.db({ uo: UserOrgroleE.NAME })
					.select('uo.org_id', 'r.name', 'r.url')
					.leftJoin({ org: OrgroleOfRouteGroupE.NAME }, 'uo.orgrole_id', 'org.orgrole_id')
					.leftJoin({ rg: RouteOfRouteGroupE.NAME }, 'org.route_group_id', 'rg.route_group_id')
					.leftJoin({ r: RouteE.NAME }, 'rg.route_id', 'r.id')
					.where('uo.user_id', idUser);
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelExSQL.listRouteForOrgroleByUserId',
					'Не удалось получить роли пользователя по организациям'
				);
			}

			return resp;
		});
		return resp;
	}

	/**
	 * Получить список доступных контроллеров по userId
	 */
	public async listCtrlByUserId(idUser: number): Promise<CtrlAccessI[]> {
		let resp: CtrlAccessI[] = null;
		const sKeyCahce = `RoleModelExSQL.listCtrlByUserId(${idUser})`;
		resp = await this.autoCache(sKeyCahce, 3600, async () => {
			try {
				resp = await this.db({ ug: UserGroupE.NAME })
					.select('c.alias')
					.leftJoin({ g: AccessGroupE.NAME }, 'g.group_id', 'ug.group_id')
					.leftJoin({ c: CtrlAccessE.NAME }, 'c.id', 'g.ctrl_access_id')
					.where('ug.user_id', idUser);
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelExSQL.listCtrlByUserId',
					'Не удалось получить доступ к контроллерам по user id'
				);
			}
			return resp;
		});
		return resp;
	}

	/**
	 * получить IDs ролей, которые принадлежат пользователю
	 */
	public async listRoleIdByUserId(idUser: number): Promise<number[]> {
		const sKeyCahce = `RoleModelSQL.listRoleIdByUserId(${idUser})`;

		const resp = await this.autoCache(sKeyCahce, 3600, async () => {
			let res;
			try {
				res = (await this.db<UserRoleI>(UserRoleE.NAME)
					.where({ user_id: idUser })
					.select('role_id')).map(userRole => userRole.role_id);
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelSQL.listRoleIdByUserId',
					'Не удалось получить IDs ролей, которые принадлежат пользователю'
				);
			}
			return res;
		});
		return resp;
	}

	/**
	 * Получить IDs роутгрупп, которые доступны данной роли
	 * @param userId
	 */
	public async listRouteGroupIdByRoleId(idRole: number): Promise<number[]> {
		const sKeyCahce = `RoleModelSQL.listRouteGroupIdByRoleId(${idRole})`;

		const resp = await this.autoCache(sKeyCahce, 3600, async () => {
			let res;
			try {
				res = (await this.db<RoleOfRouteGroupI>(RoleOfRouteGroupE.NAME)
					.where({ role_id: idRole })
					.select('route_group_id')).map(roleOfRouteGroup => roleOfRouteGroup.route_group_id);
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelSQL.listRouteGroupIdByRoleId',
					'Не удалось получить IDs роутгрупп, которые доступны данной роли'
				);
			}
			return res;
		});
		return resp;
	}

	/**
	 * Получить роуты, принадлежащие роутгруппе
	 * @param userId
	 */
	public async listRouteByRouteGroupId(idRouteGroup: number): Promise<RouteI[]> {
		const sKeyCahce = `RoleModelSQL.listRouteByRouteGroupId(${idRouteGroup})`;

		const resp = await this.autoCache(sKeyCahce, 3600, async () => {
			let res: RouteI[];
			try {
				res = await this.db<RouteI>({ r: RouteE.NAME })
					.leftJoin<RouteOfRouteGroupI>({ rrg: RouteOfRouteGroupE.NAME }, 'r.id', 'rrg.route_id')
					.where('rrg.route_group_id', idRouteGroup)
					.select('r.*');
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelSQL.listRouteByRouteGroupId',
					'Не удалось получить IDs роутгрупп, которые доступны данной роли'
				);
			}
			return res;
		});
		return resp;
	}
}
