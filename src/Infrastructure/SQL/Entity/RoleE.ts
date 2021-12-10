import { ModelRulesC, ModelRulesT } from '@a-a-game-studio/aa-components/lib';

/**
 * Интерфейс таблицы роли по сайту
 */
export interface RoleI {
    id: number; // ID роли по сайту
    name: string; // имя роли по сайту
    alias: RoleT; // Псевдоним роли в организациях
    created_at: string; // дата создания
    updated_at: string; // дата изменения
}

/**
 * Роли пользователей на сайте
 */
export enum RoleT {
    /** Администратор */
    administrator = 'administrator',
    /** Базовый модератор */
    baseModerator = 'base_moderator',
}

/**
 * Роль по всему сайту
 */
export class RoleE {
    /** имя таблицы */
    public static NAME = 'p63_role';
}
