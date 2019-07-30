// Системные сервисы
import {UserSys} from '../../../System/UserSys';
import {ErrorSys} from '../../../System/ErrorSys';
import MainRequest from '../../../System/MainRequest';

// Классы SQL Запросов
import {UserSQL} from '../../../Infrastructure/SQL/Repository/UserSQL';
import {CtrlAccessSQL} from '../../../Infrastructure/SQL/Repository/CtrlAccessSQL';

/**
 * Контроллеры доступа по модулям
 * Внутри метода делаем нужную бизнес логику
 */
export class CtrlAccessM
{
    /** @var SQL\UserSQL userSQL */
    private userSQL: UserSQL;

    /** @var SQL\CtrlAccessSQL ctrlAccessSQL */
    private ctrlAccessSQL: CtrlAccessSQL;


    /** @var Sys\ErrorSys errorSys */
    private errorSys: ErrorSys;

    constructor(req:MainRequest) {

        this.errorSys = req.sys.errorSys;

        this.userSQL = new UserSQL(req);
        this.ctrlAccessSQL = new CtrlAccessSQL(req);
    }


    /**
     * Получить список контроллеров доступа
     *
     * @param array data
     * @return array|null
     */
    public getAllCtrlAccess(data:{ [key: string]: any }): any{
        let ok = this.errorSys.isOk(); // Статус выполнения

        this.errorSys.declare([
            'get_all_roles' // Не удалось получить группы пользователей
        ]);

        let allCtrlAccessList = null;
        if( ok ){ // Получить список ролей
            allCtrlAccessList = this.ctrlAccessSQL.getAllCtrlAccess();

            if( !allCtrlAccessList ){
                ok = false;
                this.errorSys.error('get_all_roles','Не удалось получить группы пользователей');
            }

        }

        let out = null;
        if( ok ){ // Формирование ответа
            out = allCtrlAccessList;
        }

        return out;
    }


    /**
     * Получить иформацию по контроллеру
     *
     * @param array data
     * @return array|null
     */
    public getCtrlAccessByAlias(data:{ [key: string]: any }): any{
        let ok = this.errorSys.isOk();

        this.errorSys.declare([
            'get_ctrl_access' // Не удалось получить контроллер доступа
        ]);

        let aliasCtrlAccess = null;
        if( !data['alias'] ){
            ok = false;
            this.errorSys.error('alias','Отсутствует Alias группы');
        } else {
            aliasCtrlAccess = String(data['alias']);
        }

        let ctrlAccessList = {};
        if( ok ){ // Получить группу
            ctrlAccessList = this.ctrlAccessSQL.getCtrlAccessByAlias(aliasCtrlAccess);

            if( !ctrlAccessList ){
                ok = false;
                this.errorSys.error('get_ctrl_access','Не удалось получить контроллер доступа');
            }
        }

        let out = null;
        if( ok ){ // Формирование ответа
            out = ctrlAccessList;
        } else {
            out = [];
        }

        return out;
    }

    /**
     * Изменить данные контроллера доступа
     *
     * @param array data
     * @return array|null
     */
    public async saveCtrlAccess(data:{ [key: string]: any }): Promise<any>{
        let ok = this.errorSys.isOk();

        this.errorSys.declare([
            'ctrl_access_id', // Отсутствует ID группы
            'save_ctrl_access' // Не удалось сохранить данные группы
        ]);

        let idCtrlAccess = 0;
        if( !data['ctrl_access_id'] ){
            ok = false;
            this.errorSys.error('ctrl_access_id','Отсутствует ID группы');
        } else {
            idCtrlAccess = Number(data['ctrl_access_id']);
        }

        let ctrlAccess = false;
        if( ok ){ // Получить группу
            ctrlAccess = await this.ctrlAccessSQL.saveCtrlAccess(idCtrlAccess, data);

            if( !ctrlAccess ){
                ok = false;
                this.errorSys.error('save_ctrl_access','Не удалось сохранить данные группы');
            }
        }

        return null;
    }

    /**
     * Добавить контроллер доступа
     *
     * @param array data
     * @return array|null
     */
    public async addCtrlAccess(data:{ [key: string]: any }): Promise<any>{
        let ok = this.errorSys.isOk();

        let resp;
        this.errorSys.declare([
            'alias', // Отсутствует alias для создания контроллера доступа
            'is_exist_ctrl_access', // Проверка на существования ctrl_access по alias провалилась
            'cnt_ctrl_access', // Контроллер с таким alias уже существует
            'add_ctrl_access' // Не удалось добавить модуль доступа
        ]);

        let aliasCtrlAccess = '';
        if( !data['alias'] ){
            ok = false;
            this.errorSys.error('alias','Отсутствует alias для создания контроллера доступа');
        } else {
            aliasCtrlAccess = String(data['alias']);
        }

        let cntCtrlAccess = 0;
        if( ok ){ // Проверить существуют ли контроллер доступа с таким ALIAS
            cntCtrlAccess = await this.ctrlAccessSQL.cntCtrlAccessByAlias(aliasCtrlAccess);
            if( cntCtrlAccess < 0 ){
                ok = false;
                this.errorSys.error('is_exist_ctrl_access','Проверка на существования ctrl_access по alias провалилась');
            }
        }

        if( ok && cntCtrlAccess > 0){ // Если контроллер уже существует - говорим об ошибке
            ok = false;
            this.errorSys.error('cnt_ctrl_access','Контроллер с таким alias уже существует');
        }


        if( ok ){ // Добавить контроллер доступа
            resp = await this.ctrlAccessSQL.addCtrlAccess(data);

            if( !resp ){
                ok = false;
                this.errorSys.error('add_ctrl_access','Не удалось добавить модуль доступа');
            }
        }

        return resp;
    }


    /**
     * Удалить контроллер доступа
     *
     * @param array data
     * @return array|null
     */
    public async delCtrlAccess(data:{ [key: string]: any }): Promise<any>{
        let ok = this.errorSys.isOk();

        this.errorSys.declare([
            'alias', // Отсутствует ID контроллера доступа
            'is_exist_ctrl_access', // Проверка на существования ctrl_access по alias провалилась
            'cnt_ctrl_access', // Контроллера с таким alias не существует
            'del_ctrl_access' // Не удалось удалить контроллер доступа
        ]);

        let aliasCtrlAccess = null;
        if( !data['alias'] ){
            ok = false;
            this.errorSys.error('alias','Отсутствует alias контроллера доступа');
        } else {
            aliasCtrlAccess = data['alias'];
        }

        let cntCtrlAccess = 0;
        if( ok ){ // Проверить существуют ли контроллер доступа с таким ALIAS
            cntCtrlAccess = await this.ctrlAccessSQL.cntCtrlAccessByAlias(aliasCtrlAccess);
            if( cntCtrlAccess < 0 ){
                ok = false;
                this.errorSys.error('is_exist_ctrl_access','Проверка на существования ctrl_access по alias провалилась');
            }
        }

        if( ok && cntCtrlAccess < 1){ // Если контроллер не существует - говорим об ошибке
            ok = false;
            this.errorSys.error('cnt_ctrl_access','Контроллера с таким alias не существует');
        }

        let okCtrlAccess:boolean = false;
        if( ok ){ // Получить контроллер доступа
            okCtrlAccess = await this.ctrlAccessSQL.delCtrlAccessByAlias(aliasCtrlAccess);

            if( !okCtrlAccess ){
                ok = false;
                this.errorSys.error('del_ctrl_access','Не удалось удалить контроллер доступа');
            }
        }

        return null;
    }



}
