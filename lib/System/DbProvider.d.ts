import * as Knex from 'knex';
export declare class DbProvider {
    current: Knex;
    db: Knex;
    constructor(db: Knex);
    transaction<T>(func: () => Promise<T>): Promise<T>;
}
