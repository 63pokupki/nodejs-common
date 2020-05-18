import { MainRequest } from '../../../System/MainRequest';
import BaseSQL from '../../../System/BaseSQL';
import { P63UserVisitI } from '../Entity/P63UserVisitE';
/**
 * Запросы для визитов пользователей
 */
export declare class P63UserVisitSQL extends BaseSQL {
    constructor(req: MainRequest);
    /**
     * Получить последний актуальный визит пользователя
     * Срок актуальности 1 час
     */
    oneLastUserVisit(idUser: number): Promise<P63UserVisitI>;
    /**
     * Добавить визит пользователя
     */
    addUserVisit(idUser: number): Promise<number>;
}
