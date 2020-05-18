"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSQL_1 = require("../../../System/BaseSQL");
const P63UserVisitE_1 = require("../Entity/P63UserVisitE");
/**
 * Запросы для визитов пользователей
 */
class P63UserVisitSQL extends BaseSQL_1.default {
    constructor(req) {
        super(req);
    }
    // ==================================
    // SELECT
    // ==================================
    /**
     * Получить последний актуальный визит пользователя
     * Срок актуальности 1 час
     */
    async oneLastUserVisit(idUser) {
        const sql = `
            SELECT * FROM ${P63UserVisitE_1.P63UserVisitE.NAME} uv
            WHERE
                uv.user_id = :user_id
            AND
                uv.create_at > (NOW() - INTERVAL 1 HOUR)
            LIMIT 1
            ;
        `;
        let oneUserVisit = null;
        let sKeyCache = `P63UserVisitSQL.oneLastUserVisit(${idUser})`;
        oneUserVisit = await this.autoCache(sKeyCache, 3600, async () => {
            try {
                oneUserVisit = (await this.db.raw(sql, {
                    user_id: idUser
                }))[0][0];
            }
            catch (e) {
                this.errorSys.error('db_get_user_visit', 'Не удалось получить визит пользователя');
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
     */
    async addUserVisit(idUser) {
        let idUserVisit = 0;
        if (idUser > 0) {
            let resp = null;
            try {
                idUserVisit = (await this.db(P63UserVisitE_1.P63UserVisitE.NAME)
                    .insert({
                    user_id: idUser,
                }))[0];
            }
            catch (e) {
                this.errorSys.error('add_user_visit', 'Не удалось добавить визит пользователя');
            }
        }
        return idUserVisit;
    }
}
exports.P63UserVisitSQL = P63UserVisitSQL;
//# sourceMappingURL=P63UserVisitSQL.js.map