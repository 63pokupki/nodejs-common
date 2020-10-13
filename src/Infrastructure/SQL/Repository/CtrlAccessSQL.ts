import { CtrlAccessE, CtrlAccessI } from '../Entity/CtrlAccessE';
import BaseSQL from '../../../System/BaseSQL';

/**
 * Здесь методы для SQL запросов
 * - Группы пользователей
 */
export class CtrlAccessSQL extends BaseSQL {
	// ========================================
	// SELECT
	// ========================================

	/**
	 * Получить контроллер доступа по Alias
	 * @param aliasCtrlAccess
	 */
	public async getCtrlAccessByAlias(aliasCtrlAccess: string): Promise<CtrlAccessI> {
		let resp: CtrlAccessI = null;

		const sql = `
            SELECT
                ca.id,
                ca.alias,
                ca.name,
                ca.descript
            FROM ${CtrlAccessE.NAME} ca
            WHERE ca.alias = :alias
			LIMIT 1
			;
        `;

		try {
			resp = (await this.db.raw(sql, { alias: aliasCtrlAccess }))[0][0];
		} catch (e) {
			this.errorSys.error('get_ctrl_access', 'Не удалось получить контроль доступа');
		}

		return resp;
	}

	/**
	 * Получить контроллер доступа по ID
	 * @param idCtrlAccess
	 */
	public async getCtrlAccessByID(idCtrlAccess: number): Promise<CtrlAccessI> {
		let resp: CtrlAccessI = null;

		const sql = `
            SELECT
                ca.id,
                ca.alias,
                ca.name,
                ca.descript
            FROM ${CtrlAccessE.NAME} ca
            WHERE ca.id = :id_ctrl_access
			LIMIT 1
			;
        `;

		try {
			resp = (await this.db.raw(sql, { id_ctrl_access: idCtrlAccess }))[0][0];
		} catch (e) {
			this.errorSys.error('get_ctrl_access', 'Не удалось получить контроль доступа');
		}

		return resp;
	}

	/** Получить список контроллеров доступа */
	public async getAllCtrlAccess(): Promise<CtrlAccessI[]> {
		let ctrlAccessList: CtrlAccessI[] = [];
		let bCache = false; // Наличие кеша
		let sCache = null;

		// Пробуем получить данные из кеша
		sCache = await this.redisSys.get('CtrlAccessSQL.getAllCtrlAccess()');

		if (sCache) {
			bCache = true;
			this.errorSys.devNotice('cache:CtrlAccessSQL.getAllCtrlAccess()', 'Значение взято из кеша');
		}

		if (!bCache) { // Получаем весь список групп
			const sql = `
                SELECT
                    ca.id,
                    ca.alias,
                    ca.name
                FROM ${CtrlAccessE.NAME} ca
                ;
            `;

			try {
				ctrlAccessList = (await this.db.raw(sql))[0];

				// Если значения нет в кеше - добавляем его в кеш
				this.redisSys.set('CtrlAccessSQL.getAllCtrlAccess()', JSON.stringify(ctrlAccessList), 3600);
			} catch (e) {
				this.errorSys.error('get_list_ctrl_access', 'Не удалось получить группы пользователя');
			}
		} else {
			// Если значение взято из кеша - отдаем его в ответ
			ctrlAccessList = JSON.parse(sCache);
		}

		return ctrlAccessList;
	}

	// ========================================
	// UPDATE
	// ========================================

	/**
	 * Сохранить контроллер доступа
	 * @param idCtrlAccess
	 * @param data
	 */
	public async saveCtrlAccess(idCtrlAccess: number, data: CtrlAccessI): Promise<boolean> {
		const validData = this.logicSys.fValidData(new CtrlAccessE().getRulesUpdate(), data);
		let resp = 0;

		try {
			resp = await this.db(CtrlAccessE.NAME).where({ id: idCtrlAccess }).update(validData);

			// Удалить связанный кеш
			const aRelatedKeyRedis = await this.redisSys.keys('CtrlAccessSQL*');
			this.redisSys.del(aRelatedKeyRedis);
		} catch (e) {
			this.errorSys.error('save_ctrl_access', 'Не удалось сохранить изменения в группе');
		}

		return Boolean(resp);
	}

	// ========================================
	// INSERT
	// ========================================

	/**
	 * Добавить контроль доступа
	 * @param data
	 */
	public async addCtrlAccess(data: CtrlAccessI): Promise<boolean> {
		const validData = this.logicSys.fValidData(new CtrlAccessE().getRulesInsert(), data);
		let resp = 0;

		try {
			resp = (await this.db(CtrlAccessE.NAME).returning('id').insert(validData))[0];

			// Удалить связанный кеш
			const aRelatedKeyRedis = await this.redisSys.keys('CtrlAccessSQL*');
			this.redisSys.del(aRelatedKeyRedis);
		} catch (e) {
			this.errorSys.error('add_ctrl_access', 'Не удалось добавить контроль доступа');
		}

		return Boolean(resp);
	}

	// ========================================
	// DELETE
	// ========================================

	/**
	 * Удалить контроллер доступа по алиасу
	 * @param aliasCtrlAccess
	 */
	public async delCtrlAccessByAlias(aliasCtrlAccess: string): Promise<boolean> {
		let resp = 0;

		try {
			resp = await this.db(CtrlAccessE.NAME).where({ alias: aliasCtrlAccess }).limit(1).del();

			// Удалить связанный кеш
			const aRelatedKeyRedis = await this.redisSys.keys('CtrlAccessSQL*');
			this.redisSys.del(aRelatedKeyRedis);
		} catch (e) {
			this.errorSys.error('del_ctrl_access', 'Не удалось удалить контроллер доступа');
		}

		return Boolean(resp);
	}

	// ========================================
	// COUNT
	// ========================================

	/**
     * Проверить наличия контроллера доступа по ALIAS
     * Alias уникальное поле потому LIMIT 1
     *
     * @param string aliasCtrlAccess
     * @return integer
     */
	public async cntCtrlAccessByAlias(aliasCtrlAccess: string): Promise<number> {
		let ok = this.errorSys.isOk();

		let resp = null;
		let cntCtrlAccess = 0;

		if (ok) { // Получить количество контроллеров доступа
			const sql = `
                SELECT
                    COUNT(*) cnt
                FROM ctrl_access ca
                WHERE ca.alias = :alias
				LIMIT 1
				;
            `;

			try {
				resp = (await this.db.raw(sql, { alias: aliasCtrlAccess }))[0];

				cntCtrlAccess = Number(resp[0].cnt);
			} catch (e) {
				ok = false;
				this.errorSys.error('cnt_ctrl_access', 'Не удалось подсчитать контроль доступа');
			}
		}

		if (ok) {
			return cntCtrlAccess;
		}

		return -1; // В случае если произошла SQL ошибка
	}
}
