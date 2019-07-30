
// Системные сервисы
import {UserSys} from '../../../System/UserSys';
import {ErrorSys} from '../../../System/ErrorSys';
import MainRequest from '../../../System/MainRequest';

// Классы SQL Запросов
import {UserSQL} from '../../../Infrastructure/SQL/Repository/UserSQL';
import {GroupsSQL} from '../../../Infrastructure/SQL/Repository/GroupsSQL';

/**
 * Группы пользователей
 * Внутри метода делаем нужную бизнес логику
 */
export class GroupM
{
    /** @var SQL\UserSQL userSQL */
    private userSQL: UserSQL;

    /** @var SQL\GroupsSQL groupsSQL */
    private groupsSQL: GroupsSQL;

    /** @var  Sys\UserSys userSys */
    private userSys: UserSys;

    /** @var Sys\ErrorSys errorSys */
    private errorSys: ErrorSys;

    constructor(req:MainRequest) {

        this.userSQL = new UserSQL(req);
        this.groupsSQL = new GroupsSQL(req);
        this.userSys = new UserSys(req);
        this.errorSys = req.sys.errorSys;
    }


    /**
     * Получить список ролей/группы
     *
     * @param array data
     * @return array|null
     */
    public async getAllGroups(data:{ [key: string]: any }): Promise<any>{
        let ok = this.errorSys.isOk(); // Статус выполнения

        this.errorSys.declare([
            'get_all_roles' // Не удалось получить группы пользователей
        ]);

        let allGroupsList = null;
        if( ok ){ // Получить список ролей
            allGroupsList = await this.groupsSQL.getAllGroups();

            if( !allGroupsList ){
                ok = false;
                this.errorSys.error('get_all_roles','Не удалось получить группы пользователей');
            }

        }

        let out = null;
        if( ok ){ // Формирование ответа
            out = allGroupsList;
        }

        return out;
    }


    /**
     * Получить сокращенную иформацию группы по ID
     *
     * @param array data
     * @return array|null
     */
    public async getGroupByID(data:{ [key: string]: any }): Promise<any>{
        let ok = this.errorSys.isOk();

        let idGroup = 0;
        if( !data['group_id'] ){
            ok = false;
            this.errorSys.error('group_id','Отсутствует ID группы');
        } else {
            idGroup = Number(data['group_id']);
        }

        let groupList = [];
        if( ok ){ // Получить группу
            groupList = await this.groupsSQL.getGroupByID(idGroup);

            if( !groupList ){
                ok = false;
                this.errorSys.error('get_group','Не удалось получить группы пользователей');
            }
        }

        let out = null;
        if( ok ){ // Формирование ответа
            out = groupList;
        } else {
            out = [];
        }

        return out;
    }

    /**
     * Получить сокращенную иформацию группы по ID
     *
     * @param array data
     * @return array|null
     */
    public async saveGroup(data:{ [key: string]: any }): Promise<any>{
        let ok = this.errorSys.isOk();

        let idGroup = 0;
        if( !data['group_id'] ){
            ok = false;
            this.errorSys.error('group_id','Отсутствует ID группы');
        } else {
            idGroup = Number(data['group_id']);
        }

        let group = false;
        if( ok ){ // Получить группу
            group = await this.groupsSQL.saveGroup(idGroup, data);

            if( !group ){
                ok = false;
                this.errorSys.error('save_group','Не удалось сохранить данные группы');
            }
        }

        return null;
    }

}
