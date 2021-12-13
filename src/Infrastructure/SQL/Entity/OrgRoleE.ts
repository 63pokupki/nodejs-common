import { ModelRulesC, ModelRulesT } from '@a-a-game-studio/aa-components/lib';

/**
 * Интерфейс таблицы p63_orgrole
 */
export interface OrgRoleI {
    id:number; // ID орг роли
    name:string; // Имя роли в организациях
    alias: OrgRoleT; // Псевдоним роли в организациях
    created_at: string; // дата создания
    updated_at: string; // дата обновления
}

/**
 * Роли сотрудников в организациях
 */
export enum OrgRoleT {
    /** Владелец */
    creator = 'creator',
    /** Организатор */
    organizer = 'organizer',
    /** Менеджер */
    manager = 'manager',
    /** Бухгалтер */
    accountant = 'accountant',
    /** Разборщик */
    parser = 'parser',
}

/**
 * таблица ролей в организациях
 */
export class OrgRoleE {
    public static NAME = 'p63_orgrole';
}