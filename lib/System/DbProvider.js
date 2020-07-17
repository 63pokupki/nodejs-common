"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbProvider = void 0;
class DbProvider {
    constructor(db) {
        this.db = db;
        this.current = db;
    }
    async transaction(func) {
        const trx = await this.db.transaction();
        this.current = trx;
        try {
            const result = await func();
            trx.commit();
            return result;
        }
        catch (e) {
            trx.rollback();
            throw e;
        }
        finally {
            this.current = this.db;
        }
    }
}
exports.DbProvider = DbProvider;
//# sourceMappingURL=DbProvider.js.map