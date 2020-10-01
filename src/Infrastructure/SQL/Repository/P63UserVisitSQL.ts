import BaseSQL from '../../../System/BaseSQL';
import { P63UserVisitE, P63UserVisitI } from '../Entity/P63UserVisitE';

/** Запросы для визитов пользователей */
export class P63UserVisitSQL extends BaseSQL {
	// ==================================
	// SELECT
	// ==================================

	/**
	 * Получить последний актуальный визит пользователя
	 * Срок актуальности 1 час
	 * @param idUser
	 */
	public async oneLastUserVisit(idUser: number): Promise<P63UserVisitI> {
		const sql = `
            SELECT * FROM ${P63UserVisitE.NAME} uv
            WHERE
                uv.user_id = :user_id
            AND
                uv.created_at > (NOW() - INTERVAL 1 HOUR)
            LIMIT 1
            ;
        `;

		let oneUserVisit: P63UserVisitI = null;
		const sKeyCache = `P63UserVisitSQL.oneLastUserVisit(${idUser})`;
		oneUserVisit = await this.autoCache(sKeyCache, 3600, async () => {
			try {
				oneUserVisit = (await this.db.raw(sql, { user_id: idUser }))[0][0];
			} catch (e) {
				this.errorSys.errorEx(e, 'db_get_user_visit', 'Не удалось получить визит пользователя');
			}

			return oneUserVisit;
		});

		return oneUserVisit;
	}

	// ========================================
	// INSERT
	// ========================================

	/**
	 * Добавить визит пользователя
	 * @param idUser
	 */
	public async addUserVisit(idUser: number): Promise<number> {
		let idUserVisit = 0;

		if (idUser > 0) {
			try {
				idUserVisit = (await this.db(P63UserVisitE.NAME).insert({ user_id: idUser }))[0];
			} catch (e) {
				this.errorSys.errorEx(e, 'add_user_visit', 'Не удалось добавить визит пользователя');
			}
		}

		return idUserVisit;
	}
}
