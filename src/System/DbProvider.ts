import Knex = require("knex");

export class DbProvider {

	public current: Knex;
	public db: Knex;

	constructor(db: Knex) {
		this.db = db;
	}

	public async transaction(func: () => Promise<void>) {
		const trx = await this.db.transaction();
		this.current = trx;
		try {
			await func();
			trx.commit();
		} catch (e) {
			trx.rollback();
			throw e;
		} finally {
			this.current = this.db;
		}
	}

}