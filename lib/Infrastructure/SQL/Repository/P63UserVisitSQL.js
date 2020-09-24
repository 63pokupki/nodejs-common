"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.P63UserVisitSQL = void 0;
const BaseSQL_1 = __importDefault(require("../../../System/BaseSQL"));
const P63UserVisitE_1 = require("../Entity/P63UserVisitE");
/**
 * Запросы для визитов пользователей
 */
class P63UserVisitSQL extends BaseSQL_1.default {
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
                uv.created_at > (NOW() - INTERVAL 1 HOUR)
            LIMIT 1
            ;
        `;
        let oneUserVisit = null;
        const sKeyCache = `P63UserVisitSQL.oneLastUserVisit(${idUser})`;
        oneUserVisit = await this.autoCache(sKeyCache, 3600, async () => {
            try {
                oneUserVisit = (await this.db.raw(sql, {
                    user_id: idUser,
                }))[0][0];
            }
            catch (e) {
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
     */
    async addUserVisit(idUser) {
        let idUserVisit = 0;
        if (idUser > 0) {
            try {
                idUserVisit = (await this.db(P63UserVisitE_1.P63UserVisitE.NAME)
                    .insert({
                    user_id: idUser,
                }))[0];
            }
            catch (e) {
                this.errorSys.errorEx(e, 'add_user_visit', 'Не удалось добавить визит пользователя');
            }
        }
        return idUserVisit;
    }
}
exports.P63UserVisitSQL = P63UserVisitSQL;
//# sourceMappingURL=P63UserVisitSQL.js.map