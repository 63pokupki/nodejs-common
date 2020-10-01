import { ModelRulesC } from '@a-a-game-studio/aa-components/lib';

/** */
export interface CtrlAccessI {
	id?: number;
	name?: string;
	alias?: string;
	descript?: string;
}

/** */
export class CtrlAccessE {
	/** Имя таблицы */
	public static NAME = 'ctrl_access';

	/** Правила обновления записей в таблице */
	public getRulesUpdate(): ModelRulesC {
		const rules = new ModelRulesC();

		rules.set(rules.rule('alias')
			.typeText()
			.error('alias - неверный формат'));

		rules.set(rules.rule('name')
			.typeText()
			.error('name - неверный формат'));

		rules.set(rules.rule('descript')
			.typeText()
			.error('descript - неверный формат'));

		return rules;
	}

	/** Правила создания записей в таблице */
	public getRulesInsert(): ModelRulesC {
		const rules = new ModelRulesC();

		rules.set(rules.rule('alias')
			.typeText()
			.error('alias - неверный формат'));

		return rules;
	}
}
