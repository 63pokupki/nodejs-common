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