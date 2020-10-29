import { ModelRulesC } from '@a-a-game-studio/aa-components/lib';

/** */
export interface UserGroupI {
	group_id?: number;
	user_id?: number;
	group_leader?: number;
	user_pending?: number;
}

/** */
export class UserGroupE {
	static NAME = 'phpbb_user_group';

	/** Правила создания записей в таблице */
	public getRulesInsert(): ModelRulesC {
		const rules = new ModelRulesC();
		return rules;
	}
}
