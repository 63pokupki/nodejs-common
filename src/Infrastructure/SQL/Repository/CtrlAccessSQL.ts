
// Глобальные сервисы

// Системные сервисы
import MainRequest from '../../../System/MainRequest';

// Сущьности и правила валидации
import {CtrlAccessE} from '../Entity/CtrlAccessE';
import BaseSQL from '../../../System/BaseSQL';

/**
 * Здесь методы для SQL запросов
 * - Группы пользователей
 */
export class CtrlAccessSQL extends BaseSQL
{

    constructor(req:MainRequest) {
        super(req);
    }

    // ========================================
    // SELECT
    // ========================================

    /**
     * Получить контроллер доступа по Alias
     *
     * @param string aliasCtrlAccess
     * @return array|null
     */
    public async getCtrlAccessByAlias(aliasCtrlAccess:string): Promise<any>{
        let ok = this.errorSys.isOk();
        let resp:any = null;
        let sql = '';

        // Декларация ошибок
        this.errorSys.declare([
            'get_ctrl_access',
            'get_ctrl_access_not_found'
        ]);

        sql = `
            SELECT
                ca.id,
                ca.alias,
                ca.name,
                ca.descript
            FROM ctrl_access ca
            WHERE ca.alias = :alias
            LIMIT 1
        `;

        try{
            resp = (await this.db.raw(sql, {
                'alias': aliasCtrlAccess
            }))[0];

        } catch (e){
            ok = false;
            this.errorSys.error('get_ctrl_access', 'Не удалось получить контроль доступа');
        }

        if( ok && resp[0] ){
            resp = resp[0];
        } else {
            this.errorSys.error('get_ctrl_access_not_found', 'Не удалось найти контроль доступа');
        }

        return resp;
    }

    /**
     * Получить контроллер доступа по ID
     *
     * @param integer idCtrlAccess
     * @return array|null
     */
    public async getCtrlAccessByID(idCtrlAccess:number): Promise<any>{
        let ok = this.errorSys.isOk();
        let resp:any = null;

        // Декларация ошибок
        this.errorSys.declare([
            'get_ctrl_access',
            'ctrl_access_not_found'
        ]);

        let sql = `
            SELECT
                ca.id,
                ca.alias,
                ca.name,
                ca.descript
            FROM ctrl_access ca
            WHERE ca.id = :id_ctrl_access
            LIMIT 1
        `;

        try{
            resp = (await this.db.raw(sql, {
                'id_ctrl_access': idCtrlAccess
            }))[0];

        } catch (e){
            ok = false;
            this.errorSys.error('get_ctrl_access', 'Не удалось получить контроль доступа');
        }


        if ( ok && resp.length > 0) {
            resp = resp[0];
        } else {
            resp = null;
            ok = false;
            this.errorSys.error('ctrl_access_not_found', 'Контроллер доступа не найден');
        }
        return resp;
    }


    /**
     * Получить список контроллеров доступа
     *
     * @return array|null
     */
    public async getAllCtrlAccess(): Promise<any>{
        let ok = this.errorSys.isOk();
        let bCache = false; // Наличие кеша
        let sql = '';
        let resp:any = null;

        // Декларация ошибок
        this.errorSys.declare([
            'get_list_ctrl_access'
        ]);

        let sCache = null;
        if( ok ){ // Пробуем получить данные из кеша
            sCache = await this.redisSys.get("CtrlAccessSQL.getAllCtrlAccess()");


            if( sCache ){
                bCache = true;
                this.errorSys.devNotice(
                    "cache:CtrlAccessSQL.getAllCtrlAccess()",
                    'Значение взято из кеша'
                );
            }
        }

        let ctrlAccessList = null;
        if( ok && !bCache ){ // Получаем весь список групп
            sql = `
                SELECT
                    ca.id,
                    ca.alias,
                    ca.name
                FROM ctrl_access ca
                ;
            `;

            try{
                ctrlAccessList = (await this.db.raw(sql))[0];
            } catch (e){
                ok = false;
                this.errorSys.error('get_list_ctrl_access', 'Не удалось получить группы пользователя');
            }
        }

        if( ok && !bCache ){ // Если значения нет в кеше - добавляем его в кеш
            this.redisSys.set(
                "CtrlAccessSQL.getAllCtrlAccess()",
                JSON.stringify(ctrlAccessList),
                3600
            );
        }

        if( ok && bCache ){ // Если значение взято из кеша - отдаем его в ответ
            ctrlAccessList = JSON.parse(sCache);
        }

        // Формирование ответа
        return ctrlAccessList;
    }

    // ========================================
    // UPDATE
    // ========================================

    /**
     * Сохранить контроллер доступа
     *
     * @param integer idCtrlAccess
     * @return boolean
     */
    public async saveCtrlAccess(idCtrlAccess:number, data:{ [key: string]: any }): Promise<boolean>{
        let ok = this.errorSys.isOk();

        // Декларация ошибок
        this.errorSys.declare([
            'save_ctrl_access'
        ]);

        let vCtrlAccessE = new CtrlAccessE();
        if( ok && this.modelValidatorSys.fValid(vCtrlAccessE.getRulesUpdate(), data) ){

            let resp = null;
            try{
                resp = await this.db('ctrl_access')
                    .where({
                        id: idCtrlAccess
                    })
                    .update(this.modelValidatorSys.getResult());

            } catch (e){
                ok = false;
                this.errorSys.error('save_ctrl_access', 'Не удалось сохранить изменения в группе');
            }

        }

        let aRelatedKeyRedis = [];
        if( ok ){ // Удалить связанный кеш
            aRelatedKeyRedis = await this.redisSys.keys('CtrlAccessSQL*');
            this.redisSys.del(aRelatedKeyRedis);
        }

        return ok;
    }

    // ========================================
    // INSERT
    // ========================================

    /**
     * Добавить контроль доступа
     *
     * @return boolean
     */
    public async addCtrlAccess(data:{ [key: string]: any }): Promise<boolean>{
        let ok = this.errorSys.isOk();
        let resp;
        // Декларация ошибок
        this.errorSys.declare([
            'add_ctrl_access'
        ]);

        let vCtrlAccessE = new CtrlAccessE();
        if( ok && this.modelValidatorSys.fValid(vCtrlAccessE.getRulesInsert(), data) ){


            try{
                resp = await this.db('ctrl_access')
                .returning('id')
                    .insert(this.modelValidatorSys.getResult());
                    if(resp){
                        resp = resp[0];
                    }

            } catch (e){
                ok = false;
                this.errorSys.error('add_ctrl_access', 'Не удалось добавить контроль доступа');
            }

        }

        let aRelatedKeyRedis = [];
        if( ok ){ // Удалить связанный кеш
            aRelatedKeyRedis = await this.redisSys.keys('CtrlAccessSQL*');
            this.redisSys.del(aRelatedKeyRedis);
        }

        return resp;
    }

    // ========================================
    // DELETE
    // ========================================


    /**
     * удалить контроллер доступа по ID
     *
     * @param string aliasCtrlAccess
     * @return boolean
     */
    public async delCtrlAccessByAlias(aliasCtrlAccess:string): Promise<boolean>{
        let ok = this.errorSys.isOk();

        // Декларация ошибок
        this.errorSys.declare([
            'del_ctrl_access'
        ]);

        let resp = null;
        try{
            resp = await this.db('ctrl_access')
                .where({
                    alias: aliasCtrlAccess,
                })
                .limit(1)
                .del(this.modelValidatorSys.getResult());

        } catch (e){
            ok = false;
            this.errorSys.error('del_ctrl_access', 'Не удалось удалить контроллер доступа');
        }

        let aRelatedKeyRedis = [];
        if( ok ){ // Удалить связанный кеш
            aRelatedKeyRedis = await this.redisSys.keys('CtrlAccessSQL*');
            this.redisSys.del(aRelatedKeyRedis);
        }

        return ok;
    }

    // ========================================
    // COUNT
    // ========================================

    /**
     * Проверить наличия контроллера доступа по ALIAS
     * Alias униакльное поле потому LIMIT 1
     *
     * @param string aliasCtrlAccess
     * @return integer
     */
    public async cntCtrlAccessByAlias(aliasCtrlAccess:string): Promise<number>{
        let ok = this.errorSys.isOk();

        // Декларация ошибок
        this.errorSys.declare([
            'cnt_ctrl_access'
        ]);

        let resp = null;
        let cntCtrlAccess = 0;

        if( ok ){ // Получить количество контроллеров доступа
            let sql = `
                SELECT
                    COUNT(*) cnt
                FROM ctrl_access ca
                WHERE ca.alias = :alias
                LIMIT 1
            `;

            try{
                resp = (await this.db.raw(sql, {
                    'alias': aliasCtrlAccess
                }))[0];

                cntCtrlAccess = Number(resp[0]['cnt']);
            } catch (e){
                ok = false;
                this.errorSys.error('cnt_ctrl_access', 'Не удалось подсчитать контроль доступа');
            }
        }

        if( ok ){ // Ответ
            return cntCtrlAccess;
        } else {
            return -1; // В случае если произошла SQL ошибка
        }

    }

}
