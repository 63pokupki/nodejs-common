"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Сущьности и правила валидации
const GroupsE_1 = require("../Entity/GroupsE");
const BaseSQL_1 = require("../../../System/BaseSQL");
/**
 * Здесь методы для SQL запросов
 * - Группы пользователей
 */
class GroupsSQL extends BaseSQL_1.default {
    constructor(req) {
        super(req);
    }
    // ========================================
    // SELECT
    // ========================================
    /**
     * Получить группу по ID
     *
     * @param integer idGroup
     * @return array|null
     */
    async getGroupByID(idGroup) {
        let ok = this.errorSys.isOk();
        let resp = null;
        let sql = '';
        // Декларация ошибок
        this.errorSys.declare([
            'get_group',
            'group_not_found'
        ]);
        sql = `
            SELECT
                g.group_id,
                g.alias,
                g.group_type,
                g.group_name,
                g.group_desc
            FROM phpbb_groups g
            WHERE g.group_id = :id_group
            LIMIT 1
        `;
        try {
            resp = (await this.db.raw(sql, {
                id_group: idGroup
            }))[0];
        }
        catch (e) {
            ok = false;
            this.errorSys.error('get_group', 'Не удалось получить группу');
        }
        if (ok && resp.length > 0) {
            resp = resp[0];
        }
        else {
            resp = null;
            ok = false;
            this.errorSys.error('group_not_found', 'Группа не найден');
        }
        return resp;
    }
    /**
     * Получить группы/роли
     *
     * @return array|null
     */
    async getAllGroups() {
        let ok = this.errorSys.isOk();
        let bCache = false; // Наличие кеша
        let sql = '';
        let resp = null;
        // Декларация ошибок
        this.errorSys.declare([
            'get_roles'
        ]);
        let sCache = null;
        if (ok) { // Пробуем получить данные из кеша
            sCache = await this.redisSys.get("GroupsSQL.getAllGroups()");
            if (sCache) {
                bCache = true;
                this.errorSys.devNotice("cache:GroupsSQL.getAllGroups()", 'Значение взято из кеша');
            }
        }
        let groupList = null;
        if (ok && !bCache) { // Получаем весь список групп
            sql = `
                SELECT
                    pg.group_id,
                    pg.group_name,
                    pg.alias
                FROM phpbb_groups pg
                ;
            `;
            try {
                groupList = (await this.db.raw(sql))[0];
            }
            catch (e) {
                ok = false;
                this.errorSys.error('get_roles', 'Не удалось получить группы пользователя');
            }
        }
        if (ok && !bCache) { // Если значения нет в кеше - добавляем его в кеш
            this.redisSys.set("GroupsSQL.getAllGroups()", JSON.stringify(groupList), 3600);
        }
        if (ok && bCache) { // Если значение взято из кеша - отдаем его в ответ
            groupList = JSON.parse(sCache);
        }
        // Формирование ответа
        return groupList;
    }
    // ========================================
    // UPDATE
    // ========================================
    /**
     * Сохранить группу по ID
     *
     * @param integer idGroup
     * @return boolean
     */
    async saveGroup(idGroup, data) {
        let ok = this.errorSys.isOk();
        let sql = '';
        // Декларация ошибок
        this.errorSys.declare([
            'save_group'
        ]);
        let vGroupsE = new GroupsE_1.GroupsE();
        if (ok && this.modelValidatorSys.fValid(vGroupsE.getRulesUpdate(), data)) {
            let resp = null;
            try {
                resp = await this.db('phpbb_groups')
                    .where({
                    group_id: idGroup
                })
                    .update(this.modelValidatorSys.getResult());
            }
            catch (e) {
                ok = false;
                this.errorSys.error('save_group', 'Не удалось сохранить изменения в группе');
            }
        }
        let aRelatedKeyRedis = [];
        if (ok) { // Удалить связанный кеш
            aRelatedKeyRedis = await this.redisSys.keys('GroupsSQL*');
            this.redisSys.del(aRelatedKeyRedis);
        }
        return ok;
    }
}
exports.GroupsSQL = GroupsSQL;
//# sourceMappingURL=GroupsSQL.js.map