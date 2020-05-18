/**
 * Интерфейс таблицы визитов пользователей
 */
export interface P63UserVisitI {
    id?: number;
    user_id?: number;
    create_at?: string;
}
/**
 * Визиты пользователей
 */
export declare class P63UserVisitE {
    static NAME: string;
    /**
     *  Правила создания записей в таблице
     */
    getRulesInsert(): {
        [key: string]: any;
    };
}
