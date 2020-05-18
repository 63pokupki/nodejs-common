

// Компоненты
import {ModelRulesC} from '@a-a-game-studio/aa-components/lib';

/**
 * Интерфейс таблицы визитов пользователей
 */
export interface P63UserVisitI{
    id?:number;
    user_id?:number;
    create_at?:string;
}

/**
 * Визиты пользователей
 */
export class P63UserVisitE
{
    //Имя таблицы
    public static NAME = 'p63_user_visit';

    /**
     *  Правила создания записей в таблице
     */
	public getRulesInsert(){
        let rules = new ModelRulesC();

        rules.set(rules.tpl('user_id', true)
            .tplID('user_id - Неверный формат')
        );

        return rules.get();
    }

}
