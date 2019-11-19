"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbProvider {
    constructor(db) {
        this.db = db;
    }
    async transaction(func) {
        const trx = await this.db.transaction();
        this.current = trx;
        try {
            await func();
            trx.commit();
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