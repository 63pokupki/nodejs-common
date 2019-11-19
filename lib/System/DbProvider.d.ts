import Knex = require("knex");
export declare class DbProvider {
    current: Knex;
    db: Knex;
    constructor(db: Knex);
    transaction(func: () => Promise<void>): Promise<void>;
}
