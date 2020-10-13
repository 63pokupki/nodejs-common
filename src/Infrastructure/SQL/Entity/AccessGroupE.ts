import { ModelRulesC } from '@a-a-game-studio/aa-components/lib';

/** */
export interface AccessGroupI {
	id?: number;
	group_id?: number;
	ctrl_access_id?: number;
	create_access?: boolean;
	read_access?: boolean;
	update_access?: boolean;
	delete_access?: boolean;
}

/** */
export class AccessGroupE {
	/** Имя таблицы */
	static NAME = 'access_group';

	/** Правила создания записей в таблице */
	public getRulesInsert(): ModelRulesC {
		const rules = new ModelRulesC();

		rules.set(rules.rule('group_id')
			.typeInt()
			.error('group_id - неверный формат'));

		rules.set(rules.rule('ctrl_access_id')
			.typeInt()
			.error('ctrl_access_id - неверный формат'));

		return rules;
	}

	/** Обновление ключевых записей таблицы */
	public getRulesUpdate(): ModelRulesC {
		const rules = new ModelRulesC();

		rules.set(rules.rule('create_access')
			.typeBool()
			.error('create_access - неверный формат'));

		rules.set(rules.rule('read_access')
			.typeBool()
			.error('read_access - неверный формат'));

		rules.set(rules.rule('update_access')
			.typeBool()
			.error('update_access - неверный формат'));

		rules.set(rules.rule('delete_access')
			.typeBool()
			.error('delete_access - неверный формат'));

		return rules;
	}
}
