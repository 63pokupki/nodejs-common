import BaseSQL from '../../../System/BaseSQL';
import { RouteE, RouteI } from '../Entity/RouteE';
import { RouteOfRouteGroupE, RouteOfRouteGroupI } from '../Entity/RouteOfRouteGroupE';
import { UserGroupE } from '../Entity/UserGroupE';
import { UserRoleE, UserRoleI } from '../Entity/UserRoleE';
import { UserOrgroleE, UserOrgroleI } from '../Entity/UserOrgroleE';
import { OrgroleOfRouteGroupE, OrgroleOfRouteGroupI } from '../Entity/OrgroleOfRouteGroupE';
import { RoleOfRouteGroupE, RoleOfRouteGroupI } from '../Entity/RoleOfRouteGroupE';
import { AccessGroupE } from '../Entity/AccessGroupE';
import { CtrlAccessE, CtrlAccessI } from '../Entity/CtrlAccessE';

export class RoleModelSQL extends BaseSQL {
	// =====================================================
	// Роли по сайту
	// =====================================================

	/**
	 * Получить IDs ролей пользователя по сайту
	 */
	public async listRoleIdByUserId(idUser: number): Promise<number[]> {
		const sKeyCahce = `RoleModelSQL.listRoleIdByUserId(${idUser})`;

		const resp = await this.autoCache(sKeyCahce, 3600, async () => {
			let res;
			try {
				res = (await this.db<UserRoleI>(UserRoleE.NAME)
					.where({ user_id: idUser })
					.select('role_id')).map((userRole) => userRole.role_id);
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelSQL.listRoleIdByUserId',
					'Не удалось получить IDs ролей пользователя по сайту',
				);
			}
			return res;
		});
		return resp;
	}

	/**
	 * Получить IDs роутгрупп, которые доступны данной роли
	 */
	public async listRouteGroupIdByRoleId(idRole: number): Promise<number[]> {
		const sKeyCahce = `RoleModelSQL.listRouteGroupIdByRoleId(${idRole})`;

		const resp = await this.autoCache(sKeyCahce, 3600, async () => {
			let res;
			try {
				res = (await this.db<RoleOfRouteGroupI>(RoleOfRouteGroupE.NAME)
					.where({ role_id: idRole })
					.select('route_group_id')).map((roleOfRouteGroup) => roleOfRouteGroup.route_group_id);
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelSQL.listRouteGroupIdByRoleId',
					'Не удалось получить IDs роутгрупп, которые доступны данной роли',
				);
			}
			return res;
		});
		return resp;
	}

	// =====================================================
	// Роли в организациях
	// =====================================================

	/**
	 * Получить роли пользователя в организациях
	 */
	public async listOrgRoleByUserId(idUser: number): Promise<UserOrgroleI[]> {
		const sKeyCahce = `RoleModelExSQL.listOrgRoleByUserId(${idUser})`;
		const cacheRes: UserOrgroleI[] = await this.autoCache(sKeyCahce, 3600, async () => {
			let res;
			try {
				res = await this.db<UserOrgroleI>(UserOrgroleE.NAME)
					.where({ user_id: idUser })
					.select();
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelSQL.listOrgRoleByUserId',
					'Не удалось получить роли пользователя по организациям',
				);
			}

			return res;
		});
		return cacheRes;
	}

	/**
	 * Получить IDs роутгрупп, которые доступны данной орг роли
	 */
	public async listRouteGroupIdByOrgoleId(idOrgole: number): Promise<number[]> {
		const sKeyCahce = `RoleModelSQL.listRouteGroupIdByOrgoleId(${idOrgole})`;

		const resp = await this.autoCache(sKeyCahce, 3600, async () => {
			let res;
			try {
				res = (await this.db<OrgroleOfRouteGroupI>(OrgroleOfRouteGroupE.NAME)
					.where({ orgrole_id: idOrgole })
					.select('route_group_id')).map((roleOfRouteGroup) => roleOfRouteGroup.route_group_id);
			} catch (e) {
				this.errorSys.errorEx(
					e,
					'RoleModelSQL.listRouteGroupIdByOrgoleId',
					'Не удалось получить IDs роутгрупп, которые доступны данной орг роли',
				);
			}
			return res;
		});
		return resp;
	}

	// =============================================================
	// Контроллеры и группы
	// =============================================================

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
					'Не удалось получить доступ к контроллерам по user id',
				);
			}
			return resp;
		});
		return resp;
	}

	// ======================================================================
	// Роуты
	// ======================================================================

	/**
	 * Получить роуты, принадлежащие роутгруппе
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
					'Не удалось получить IDs роутгрупп, которые доступны данной роли',
				);
			}
			return res;
		});
		return resp;
	}
}
