
// Глобальные сервисы
import * as redisSys  from '../../../System/RedisSys';

// Системные сервисы
import {ErrorSys} from '../../../System/ErrorSys';
import MainRequest from '../../../System/MainRequest';

import {ModelValidatorSys} from '../../../System/ModelValidatorSys';

// Сущьности и правила валидации
import {GroupsE} from '../Entity/GroupsE';
import BaseSQL from '../../../System/BaseSQL';

/**
 * Здесь методы для SQL запросов
 * - Группы пользователей
 */
export class GroupsSQL extends BaseSQL
{

    constructor(req:MainRequest) {
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
    public async getGroupByID(idGroup:number): Promise<any>{
        let ok = this.errorSys.isOk();
        let resp: any[] = null;
        let sql:string = '';

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

        try{
            resp = (await this.db.raw(sql, {
                id_group: idGroup
            }))[0];


        } catch (e){
            ok = false;
            this.errorSys.error('get_group', 'Не удалось получить группу');
        }

        if ( ok && resp.length > 0) {
            resp = resp[0];
        } else {
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
    public async getAllGroups(): Promise<any>{
        let ok = this.errorSys.isOk();

        let bCache = false; // Наличие кеша
        let sql:string = '';
        let resp = null;

        // Декларация ошибок
        this.errorSys.declare([
            'get_roles'
        ]);

        let sCache = null;
        if( ok ){ // Пробуем получить данные из кеша
            sCache = await this.redisSys.get("GroupsSQL.getAllGroups()");

            if( sCache ){
                bCache = true;
                this.errorSys.devNotice(
                    "cache:GroupsSQL.getAllGroups()",
                    'Значение взято из кеша'
                );
            }
        }


        let groupList = null;
        if( ok && !bCache ){ // Получаем весь список групп
            sql = `
                SELECT
                    pg.group_id,
                    pg.group_name,
                    pg.alias
                FROM phpbb_groups pg
                ;
            `;

            try{
                groupList = (await this.db.raw(sql))[0];
            } catch (e){
                ok = false;
                this.errorSys.error('get_roles', 'Не удалось получить группы пользователя');
            }
        }

        if( ok && !bCache ){ // Если значения нет в кеше - добавляем его в кеш
            this.redisSys.set(
                "GroupsSQL.getAllGroups()",
                JSON.stringify(groupList),
                3600
            );
        }

        if( ok && bCache ){ // Если значение взято из кеша - отдаем его в ответ
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
    public async saveGroup(idGroup:number, data:{ [key: string]: any }): Promise<boolean>{
        let ok = this.errorSys.isOk();
        let sql:string = '';

        // Декларация ошибок
        this.errorSys.declare([
            'save_group'
        ]);

        let vGroupsE = new GroupsE();
        if( ok && this.modelValidatorSys.fValid(vGroupsE.getRulesUpdate(), data) ){

            let resp = null;
            try{
                resp = await this.db('phpbb_groups')
                    .where({
                        group_id: idGroup
                    })
                    .update(this.modelValidatorSys.getResult());

            } catch (e){
                ok = false;
                this.errorSys.error('save_group', 'Не удалось сохранить изменения в группе');
            }
        }

        let aRelatedKeyRedis = [];
        if( ok ){ // Удалить связанный кеш
            aRelatedKeyRedis = await this.redisSys.keys('GroupsSQL*');
            this.redisSys.del(aRelatedKeyRedis);
        }

        return ok;
    }

}
