import { GroupsE, GroupsI } from '../Entity/GroupsE';
import BaseSQL from '../../../System/BaseSQL';

/** Запросы для групп пользователей */
export class GroupsSQL extends BaseSQL {
	// ========================================
	// SELECT
	// ========================================

	/**
	 * Получить группу по ID
	 * @param idGroup
	 */
	public async getGroupByID(idGroup: number): Promise<any> {
		let resp: any[] = [];

		const sql = `
            SELECT
                g.group_id,
                g.alias,
                g.group_type,
                g.group_name,
                g.group_desc
            FROM ${GroupsE.NAME} g
            WHERE g.group_id = :id_group
            LIMIT 1
        `;

		try {
			resp = (await this.db.raw(sql, { id_group: idGroup }))[0];
		} catch (e) {
			this.errorSys.error('get_group', 'Не удалось получить группу');
		}

		if (resp.length > 0) {
			resp = resp[0];
		} else {
			resp = null;
			this.errorSys.error('group_not_found', 'Группа не найден');
		}

		return resp;
	}

	/** Получить группы / роли */
	public async getAllGroups(): Promise<any> {
		// Наличие кеша
		let bCache = false;

		// Пробуем получить данные из кеша
		const sCache = await this.redisSys.get('GroupsSQL.getAllGroups()');

		if (sCache) {
			bCache = true;
			this.errorSys.devNotice('cache:GroupsSQL.getAllGroups()', 'Значение взято из кеша');
		}

		let groupList = null;
		if (!bCache) { // Получаем весь список групп
			const sql = `
                SELECT
                    pg.group_id,
                    pg.group_name,
                    pg.alias
                FROM ${GroupsE.NAME} pg
                ;
            `;

			try {
				groupList = (await this.db.raw(sql))[0];

				this.redisSys.set('GroupsSQL.getAllGroups()', JSON.stringify(groupList), 3600);
			} catch (e) {
				this.errorSys.error('get_roles', 'Не удалось получить группы пользователя');
			}
		}

		if (bCache) { // Если значение взято из кеша - отдаем его в ответ
			groupList = JSON.parse(sCache);
		}

		return groupList;
	}

	// ========================================
	// UPDATE
	// ========================================

	/**
	 * Сохранить группу по ID
	 * @param idGroup
	 * @param data
	 */
	public async saveGroup(idGroup: number, data: { [key: string]: any }): Promise<boolean> {
		const validData = this.logicSys.fValidData(new GroupsE().getRulesUpdate(), data);
		let out = 0;

		try {
			out = await this.db(GroupsE.NAME).where({ group_id: idGroup }).update(validData);
			const aRelatedKeyRedis = await this.redisSys.keys('GroupsSQL*');

			// Удалить связанный кеш
			this.redisSys.del(aRelatedKeyRedis);
		} catch (error) {
			this.errorSys.error('save_group', 'Не удалось сохранить изменения в группе');
		}

		return Boolean(out);
	}
}
