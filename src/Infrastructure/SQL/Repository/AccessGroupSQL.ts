import * as _ from 'lodash';

import { AccessGroupE, AccessGroupI } from '../Entity/AccessGroupE';
import BaseSQL from '../../../System/BaseSQL';

/**
 * Здесь методы для SQL запросов
 * - Связка Групп пользователей с модулями
 */
export class AccessGroupSQL extends BaseSQL {
	// ==================================
	// SELECT
	// ==================================

	/**
	 * Получить список модулей доступных группе по ID Группы
	 * @param idGroup
	 */
	public async getCtrlAccessOfGroupByID(idGroup: number): Promise<any> {
		const ok = this.errorSys.isOk();

		let resp = [];

		if (ok) { // Получить список модулей доступных группе по ID Группы
			const sql = `
                SELECT
                    ag.id access_group_id,
                    ag.group_id,
                    ag.ctrl_access_id,
                    ag.create_access,
                    ag.read_access,
                    ag.update_access,
                    ag.delete_access,
                    ag.id access_group_id,
                    ca.alias,
                    ca.name,
                    ca.descript
                FROM ${AccessGroupE.NAME} ag
                JOIN ctrl_access ca ON ca.id = ag.ctrl_access_id
                WHERE ag.group_id = :id_group
                ;
            `;

			try {
				resp = (await this.db.raw(sql, { id_group: idGroup }))[0];
			} catch (e) {
				this.errorSys.error('get_ctrl_access', 'Не удалось получить контроль доступа');
			}
		}

		return resp;
	}

	/**
	 * Получить права CRUD по конкретному модулю
     * на основе групп к которым принадлежит пользователь
	 * @param aIdsGroup
	 * @param idCtrlAccess
	 */
	public async getAccessCRUD(aIdsGroup: number[], idCtrlAccess: number): Promise<any> {
		let ok = this.errorSys.isOk();

		if (aIdsGroup.length < 1) { // Если пользователь не имеет групп - значит у него нет прав
			ok = false;
			this.errorSys.error('user_no_has_group', 'Пользователь не состоит в группе');
		}

		let aAccessCRUD: any = {};
		if (ok) {
			// Превращаем массив Ids в строку
			const sIdsGroup = aIdsGroup.join(',');

			const sql = `
                SELECT
                    SUM(ag.create_access) \`create\`,
                    SUM(ag.read_access) \`read\`,
                    SUM(ag.update_access) \`update\`,
                    SUM(ag.delete_access) \`delete\`
                FROM ${AccessGroupE.NAME} ag
                JOIN ctrl_access ca ON ca.id = ag.ctrl_access_id
                WHERE
                    ag.group_id IN (${sIdsGroup})
                AND
                    ag.ctrl_access_id = :ctrl_access_id
                ;
            `;

			try {
				aAccessCRUD = (await this.db.raw(sql, { ctrl_access_id: idCtrlAccess }))[0][0];
			} catch (e) {
				this.errorSys.error('get_access_crud', 'Не удалось получить доступы к модулю');
			}
		}

		const a: {[key: string]: any} = {};
		_.forEach(aAccessCRUD, (v, k) => {
			a[k] = Boolean(v);
		});
		aAccessCRUD = a;

		return aAccessCRUD;
	}

	/**
	 * Получить права на доступ к модулю
     * на основе групп к которым принадлежит пользователь
	 * @param aIdsGroup
	 * @param idCtrlAccess
	 */
	public async getAccess(aIdsGroup: number[], idCtrlAccess: number): Promise<boolean> {
		let ok = this.errorSys.isOk();

		if (aIdsGroup.length < 1) { // Если пользователь не имеет групп - значит у него нет прав
			ok = false;
			this.errorSys.error('user_no_has_group', 'Пользователь не состоит в группе');
		}

		let bAccess = false;
		if (ok) {
			// Превращаем массив Ids в строку
			const sIdsGroup = aIdsGroup.join(',');

			const sql = `
                SELECT
                    count(*) cnt
                FROM ${AccessGroupE.NAME} ag
                JOIN ctrl_access ca ON ca.id = ag.ctrl_access_id
                WHERE
                    ag.group_id IN (${sIdsGroup})
                AND
                    ag.ctrl_access_id = :ctrl_access_id
                LIMIT 1
                ;
            `;

			try {
				const resp = (await this.db.raw(sql, { ctrl_access_id: idCtrlAccess }))[0];
				bAccess = Boolean(resp[0].cnt);
			} catch (e) {
				this.errorSys.errorEx(e,'get_access_to_ctrl', 'Не удалось получить доступы к модулю');
			}
		}

		return bAccess;
	}

	// ========================================
	// INSERT
	// ========================================

	/**
	 * Добавить контроль доступа к группе
	 * @param idCtrlAccess
	 * @param idGroup
	 */
	public async addCtrlAccessToGroup(idCtrlAccess: number, idGroup: number): Promise<number> {
		let ok = this.errorSys.isOk();

		let idAccessGroup = 0;
		if (ok) {
			try {
				idAccessGroup = (await this.db(AccessGroupE.NAME)
					.returning('id')
					.insert({
						group_id: idGroup,
						ctrl_access_id: idCtrlAccess,
					}))[0];

				const aRelatedKeyRedis = await this.redisSys.keys('AccessGroupSQL*');
				this.redisSys.del(aRelatedKeyRedis);
			} catch (e) {
				ok = false;
				this.errorSys.error('add_ctrl_access', 'Не удалось добавить права на модуль');
			}
		}

		return idAccessGroup;
	}

	// ========================================
	// UPDATE
	// ========================================

	/**
	 * Изменить параметры доступа
	 * @param idAccessGroup
	 * @param data
	 */
	public async saveAccessGroup(idAccessGroup: number, data: AccessGroupI): Promise<boolean> {
		const validData = this.logicSys.fValidData(new AccessGroupE().getRulesUpdate(), data);
		let out = 0;

		try {
			out = await this.db(AccessGroupE.NAME).where({ id: idAccessGroup }).update(validData);

			const aRelatedKeyRedis = await this.redisSys.keys('AccessGroupSQL*');
			this.redisSys.del(aRelatedKeyRedis);
		} catch (e) {
			this.errorSys.error('save_access_group', 'Не удалось сохранить изменения в группе');
		}

		return Boolean(out);
	}

	// ========================================
	// DELETE
	// ========================================

	/**
	 * Удалить права на модуль у группы
	 * @param idCtrlAccess
	 * @param idGroup
	 */
	public async delCtrlAccessFromGroup(idCtrlAccess: number, idGroup: number): Promise<boolean> {
		let ok = this.errorSys.isOk();

		if (ok) {
			try {
				await this.db(AccessGroupE.NAME).where({ group_id: idGroup, ctrl_access_id: idCtrlAccess })
					.limit(1).del();

				const aRelatedKeyRedis = await this.redisSys.keys('AccessGroupSQL*');
				this.redisSys.del(aRelatedKeyRedis);
			} catch (e) {
				ok = false;
				this.errorSys.error('del_ctrl_access', 'Не удалось удалить права на модуль');
			}
		}

		return ok;
	}

	// ========================================
	// COUNT
	// ========================================

	/**
	 * Проверить наличие связи между модулем и группой
     * связь модуля и группы должна быть только одна
	 * @param idCtrlAccess
	 * @param idGroup
	 */
	public async cntAccessGroup(idCtrlAccess: number, idGroup: number): Promise<number> {
		let ok = this.errorSys.isOk();

		let cntAccessGroup = 0;
		if (ok) { // Получить количество контроллеров доступа
			const sql = `
                SELECT
                    COUNT(*) cnt
                FROM access_group ag
                WHERE
                    ag.group_id = :group_id
                AND
                    ag.ctrl_access_id = :ctrl_access_id
                LIMIT 1
            `;

			try {
				const resp = (await this.db.raw(sql, {
					group_id: idGroup,
					ctrl_access_id: idCtrlAccess,
				}))[0];

				cntAccessGroup = Number(resp[0].cnt);
			} catch (e) {
				ok = false;
				this.errorSys.error('cnt_ctrl_access', 'Не удалось подсчитать контроль доступа');
			}
		}

		if (ok) { // Ответ
			return cntAccessGroup;
		}

		return -1; // В случае если произошла SQL ошибка
	}
}
