// Компоненты
import { ModelRulesC } from '@a-a-game-studio/aa-components/lib';

export class CtrlAccessE {
	// Имя таблицы
	public NAME = 'ctrl_access';

	/**
     * Обновление ключевых записей таблицы
     */
	public getRulesUpdate() {
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

		// rules.set(rules.rule('updated_at')
		//     .type('int')
		//     .def(time())
		//     .error('updated_at - неверный формат')
		// );

		return rules.get();
	}

	/**
     *  Правила создания записей в таблице
     */
	public getRulesInsert() {
		const rules = new ModelRulesC();

		rules.set(rules.rule('alias')
			.typeText()
			.error('alias - неверный формат'));

		return rules.get();
	}
}
