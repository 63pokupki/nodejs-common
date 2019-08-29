"use strict";
// Глобальные сервисы
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSQL_1 = require("../../../System/BaseSQL");
/**
 * Здесь методы для SQL запросов
 * - Управление группами пользователей
 */
class UserGroupSQL extends BaseSQL_1.default {
    constructor(req) {
        super(req);
    }
    // ========================================
    // SELECT
    // ========================================
    /**
     * Получить Группы/Роли пользователя по user_id
     *
     * @param integer idUser
     * @return array|null
     */
    async getUserGroupsByUserID(idUser) {
        let ok = this.errorSys.isOk();
        // Декларация ошибок
        this.errorSys.declare([
            'get_role'
        ]);
        let bCache = false; // Наличие кеша
        let sCache = null;
        if (ok) { // Пробуем получить данные из кеша
            sCache = await this.redisSys.get(`UserGroupSQL.getUserGroupsByUserID(${idUser})`);
            if (sCache) {
                bCache = true;
                this.errorSys.devNotice(`cache:UserGroupSQL.getUserGroupsByUserID(${idUser})`, 'Значение взято из кеша');
            }
        }
        let aUserGroups = null;
        if (ok && !bCache) { // Получаем список ролей
            let sql = `
                SELECT
                    DISTINCT pug.group_id,
                    pg.alias,
                    pg.group_name
                FROM phpbb_user_group pug
                JOIN phpbb_groups pg ON pg.group_id = pug.group_id
                WHERE
                    pug.user_id = :user_id;
                ;
            `;
            try {
                aUserGroups = (await this.db.raw(sql, {
                    user_id: idUser
                }))[0];
            }
            catch (e) {
                ok = false;
                this.errorSys.error('get_role', 'Не удалось группы пользователя');
            }
        }
        if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
            this.redisSys.set(`UserGroupSQL.getUserGroupsByUserID(${idUser})`, JSON.stringify(aUserGroups), 3600);
        }
        if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
            aUserGroups = JSON.parse(sCache);
        }
        return aUserGroups;
    }
    // ========================================
    // INSERT
    // ========================================
    /**
     * Добавить пользователя в группу - дать Роль
     * Группа/Роль
     *
     * @param integer idUser
     * @param integer idGroup
     * @return array|null
     */
    async addUserToGroup(idUser, idGroup) {
        let ok = this.errorSys.isOk();
        // Декларация ошибок
        this.errorSys.declare([
            'ctrl_user_in_group',
            'user_in_group',
            'add_role'
        ]);
        let iCountUserInGroup = 0;
        if (ok) { // Проверяем имеется ли пользователь в группе
            let sql = `
                SELECT
                    count(*) cnt
                FROM phpbb_user_group pug
                WHERE
                    pug.user_id = :user_id
                AND
                    pug.group_id = :group_id
                LIMIT 1
                ;

            `;
            try {
                let resp = (await this.db.raw(sql, {
                    user_id: idUser,
                    group_id: idGroup
                }))[0];
                iCountUserInGroup = resp[0]['cnt'];
            }
            catch (e) {
                ok = false;
                this.errorSys.error('ctrl_user_in_group', 'Не удалось проверить наличия пользователя в группе');
            }
        }
        if (ok && iCountUserInGroup > 0) { // Проверяем имеется ли пользователь в группе
            ok = false;
            this.errorSys.error('user_in_group', 'Пользователь уже состоит в группе');
        }
        if (ok) { // Если пользователя в группе нет добавляем его в группу
            let sql = `
                INSERT INTO phpbb_user_group
                    (user_id, group_id, group_leader, user_pending)
                VALUES
                    (:user_id, :group_id, 0, 0)
                ;
            `;
            let resp = null;
            try {
                resp = await this.db('phpbb_user_group').insert({
                    user_id: idUser,
                    group_id: idGroup,
                    group_leader: 0,
                    user_pending: 0
                });
            }
            catch (e) {
                ok = false;
                this.errorSys.error('add_role', 'Не удалось добавить роль');
            }
        }
        let aRelatedKeyRedis = [];
        if (ok) { // Удалить связанный кеш
            aRelatedKeyRedis = await this.redisSys.keys('UserGroupSQL*');
            this.redisSys.del(aRelatedKeyRedis);
        }
        // Формирование ответа
        return ok ? true : false;
    }
    // ========================================
    // DELETE
    // ========================================
    /**
     * Удалить пользователя из группы - убрать Роль
     * Группа/Роль
     *
     * @param integer idUser
     * @param integer idGroup
     * @return array|null
     */
    async delUserFromGroup(idUser, idGroup) {
        let ok = this.errorSys.isOk();
        // Декларация ошибок
        this.errorSys.declare([
            'ctrl_user_in_group',
            'user_in_group',
            'del_role'
        ]);
        let iCountUserInGroup = 0;
        if (ok) { // Проверяем имеется ли пользователь в группе
            let sql = `
                SELECT
                    count(*) cnt
                FROM phpbb_user_group pug
                WHERE
                    pug.user_id = :user_id
                AND
                    pug.group_id = :group_id
                LIMIT 1
                ;

            `;
            try {
                let resp = (await this.db.raw(sql, {
                    user_id: idUser,
                    group_id: idGroup
                }))[0];
                iCountUserInGroup = resp[0]['cnt'];
            }
            catch (e) {
                ok = false;
                this.errorSys.error('ctrl_user_in_group', 'Не удалось проверить наличия пользователя в группе');
            }
        }
        if (ok && iCountUserInGroup < 1) { // Проверяем имеется ли пользователь в группе
            ok = false;
            this.errorSys.error('user_in_group', 'Пользователя нет в группе');
        }
        if (ok) { // Если пользователя в группе есть удаляем его из группы
            let sql = `
                DELETE FROM phpbb_user_group
                WHERE
                    user_id = :user_id
                AND
                    group_id = :group_id
                ;
            `;
            let resp = null;
            try {
                resp = await this.db('phpbb_user_group')
                    .where({
                    user_id: idUser,
                    group_id: idGroup
                })
                    .del(this.modelValidatorSys.getResult());
            }
            catch (e) {
                ok = false;
                this.errorSys.error('del_role', 'Не удалось удалить роль');
            }
        }
        let aRelatedKeyRedis = [];
        if (ok) { // Удалить связанный кеш
            aRelatedKeyRedis = await this.redisSys.keys('UserGroupSQL*');
            this.redisSys.del(aRelatedKeyRedis);
        }
        // Формирование ответа
        return ok;
    }
}
exports.UserGroupSQL = UserGroupSQL;
//# sourceMappingURL=UserGroupSQL.js.map