import BaseSQL from '../../../System/BaseSQL';
import { UserGroupE, UserGroupI } from '../Entity/UserGroupE';

/**
 * Здесь методы для SQL запросов
 * - Управление группами пользователей
 */
export class UserGroupSQL extends BaseSQL {
	// ========================================
	// SELECT
	// ========================================

	/**
	 * Получить Группы / Роли пользователя по user_id
	 * @param idUser
	 */
	public async getUserGroupsByUserID(idUser: number): Promise<any> {
		let ok = this.errorSys.isOk();

		let bCache = false; // Наличие кеша

		let sCache = null;
		if (ok) { // Пробуем получить данные из кеша
			sCache = await this.redisSys.get(`UserGroupSQL.getUserGroupsByUserID(${idUser})`);

			if (sCache) {
				bCache = true;
				this.errorSys.devNotice(
					`cache:UserGroupSQL.getUserGroupsByUserID(${idUser})`,
					'Значение взято из кеша',
				);
			}
		}

		let aUserGroups = null;
		if (ok && !bCache) { // Получаем список ролей
			const sql = `
                SELECT
                    DISTINCT pug.group_id,
                    pg.alias,
                    pg.group_name
                FROM ${UserGroupE.NAME} pug
                JOIN phpbb_groups pg ON pg.group_id = pug.group_id
                WHERE
                    pug.user_id = :user_id;
                ;
            `;

			try {
				aUserGroups = (await this.db.raw(sql, { user_id: idUser }))[0];
			} catch (e) {
				ok = false;

				this.errorSys.error('get_role', 'Не удалось группы пользователя');
			}
		}

		if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
			this.redisSys.set(
				`UserGroupSQL.getUserGroupsByUserID(${idUser})`,
				JSON.stringify(aUserGroups),
				3600,
			);
		}

		if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
			aUserGroups = JSON.parse(sCache);
		}

		return aUserGroups;
	}

	// ========================================
	// INSERT
	// ========================================

	/**
	 * Добавить пользователя в группу - дать Роль
     * Группа / Роль
	 * @param idUser
	 * @param idGroup
	 */
	public async addUserToGroup(idUser: number, idGroup: number): Promise<boolean> {
		let ok = this.errorSys.isOk();

		let iCountUserInGroup = 0;
		if (ok) { // Проверяем имеется ли пользователь в группе
			const sql = `
                SELECT
                    count(*) cnt
                FROM ${UserGroupE.NAME} pug
                WHERE
                    pug.user_id = :user_id
                AND
                    pug.group_id = :group_id
                LIMIT 1
                ;

            `;

			try {
				const resp = (await this.db.raw(sql, {
					user_id: idUser,
					group_id: idGroup,
				}))[0];

				iCountUserInGroup = resp[0].cnt;
			} catch (e) {
				ok = false;
				this.errorSys.error('ctrl_user_in_group', 'Не удалось проверить наличия пользователя в группе');
			}
		}

		if (ok && iCountUserInGroup > 0) { // Проверяем имеется ли пользователь в группе
			ok = false;
			this.errorSys.error('user_in_group', 'Пользователь уже состоит в группе');
		}

		if (ok) { // Если пользователя в группе нет добавляем его в группу
			try {
				const resp = await this.db(UserGroupE.NAME).insert({
					user_id: idUser,
					group_id: idGroup,
					group_leader: 0,
					user_pending: 0,
				});
			} catch (e) {
				ok = false;
				this.errorSys.error('add_role', 'Не удалось добавить роль');
			}
		}

		let aRelatedKeyRedis = [];
		if (ok) { // Удалить связанный кеш
			aRelatedKeyRedis = await this.redisSys.keys('UserGroupSQL*');
			this.redisSys.del(aRelatedKeyRedis);
		}

		// Формирование ответа
		return !!ok;
	}

	// ========================================
	// DELETE
	// ========================================

	/**
	 * Удалить пользователя из группы - убрать Роль
     * Группа / Роль
	 * @param idUser
	 * @param idGroup
	 */
	public async delUserFromGroup(idUser: number, idGroup: number): Promise<boolean> {
		let ok = this.errorSys.isOk();

		let iCountUserInGroup = 0;
		if (ok) { // Проверяем имеется ли пользователь в группе
			const sql = `
                SELECT
                    count(*) cnt
                FROM ${UserGroupE.NAME} pug
                WHERE
                    pug.user_id = :user_id
                AND
                    pug.group_id = :group_id
                LIMIT 1
                ;

            `;

			try {
				const resp = (await this.db.raw(sql, {
					user_id: idUser,
					group_id: idGroup,
				}))[0];

				iCountUserInGroup = resp[0].cnt;
			} catch (e) {
				ok = false;
				this.errorSys.error('ctrl_user_in_group', 'Не удалось проверить наличия пользователя в группе');
			}
		}

		if (ok && iCountUserInGroup < 1) { // Проверяем имеется ли пользователь в группе
			ok = false;
			this.errorSys.error('user_in_group', 'Пользователя нет в группе');
		}

		if (ok) { // Если пользователя в группе есть удаляем его из группы
			try {
				const resp = await this.db(UserGroupE.NAME)
					.where({
						user_id: idUser,
						group_id: idGroup,
					})
					.del();

				const aRelatedKeyRedis = await this.redisSys.keys('UserGroupSQL*');
				this.redisSys.del(aRelatedKeyRedis);
			} catch (e) {
				ok = false;
				this.errorSys.error('del_role', 'Не удалось удалить роль');
			}
		}

		return ok;
	}
}
