
// Библиотеки
import * as _ from 'lodash';

// Глобальные сервисы
import * as redisSys  from '../../../System/RedisSys';

// Системные сервисы
import {ErrorSys} from '@a-a-game-studio/aa-components/lib';
import { MainRequest } from '../../../System/MainRequest';

import {ModelValidatorSys} from '@a-a-game-studio/aa-components/lib';

// Сущности и правила валидации
import {AccessGroupE} from '../Entity/AccessGroupE';
import BaseSQL from '../../../System/BaseSQL';
import { P63UserVisitE, P63UserVisitI } from '../Entity/P63UserVisitE';

/**
 * Запросы для визитов пользователей
 */
export class P63UserVisitSQL extends BaseSQL
{

    constructor(req:MainRequest) {
        super(req);
    }

    // ==================================
    // SELECT
    // ==================================

    /**
     * Получить последний актуальный визит пользователя
     * Срок актуальности 1 час
     */
    public async oneLastUserVisit(idUser:number): Promise<P63UserVisitI>{

        const sql = `
            SELECT * FROM ${P63UserVisitE.NAME} uv
            WHERE
                uv.user_id = :user_id
            AND
                uv.create_at > (NOW() - INTERVAL 1 HOUR)
            LIMIT 1
            ;
        `;

        let oneUserVisit:P63UserVisitI = null;
        let sKeyCache = `P63UserVisitSQL.oneLastUserVisit(${idUser})`;
        oneUserVisit = await this.autoCache(sKeyCache, 3600, async() => {
            try{
                oneUserVisit = (await this.db.raw(sql,{
                    user_id:idUser
                }))[0][0];
            } catch (e){
                this.errorSys.error('db_get_user_visit', 'Не удалось получить визит пользователя');
            }
            return oneUserVisit;
        });
        
        return oneUserVisit;
    }

    // ========================================
    // INSERT
    // ========================================

    /**
     * Добавить визит пользователя
     */
    public async addUserVisit(idUser:number): Promise<number>{

        let idUserVisit = 0;
        if( idUser > 0 ){

            let resp = null;
            try{
                idUserVisit = (await this.db(P63UserVisitE.NAME)
                    .insert({
                        user_id: idUser,
                    })
                )[0];


            } catch (e){
                this.errorSys.error('add_user_visit', 'Не удалось добавить визит пользователя');
            }

        }

        return idUserVisit;
    }

}
