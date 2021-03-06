import { ModelRulesC } from '@a-a-game-studio/aa-components/lib';

/** */
export interface UserI {
	user_type?: number;
	group_id?: number;
	user_permissions?: string;
	user_perm_from?: number;
	user_ip?: string;
	user_regdate?: number;
	username?: string;
	username_clean?: string;
}

/** */
export class UserE {
	/** Имя таблицы */
	static NAME = 'phpbb_users';

	/** Правила создания записей в таблице */
	public getRulesInsert(): ModelRulesC {
		const rules = new ModelRulesC();

		rules.set(rules.rule('user_id')
			.typeInt()
			.error('user_id - неверный формат'));

		rules.set(rules.rule('user_email')
			.typeText()
			.error('user_email - неверный формат'));

		rules.set(rules.rule('user_fullname')
			.typeText()
			.error('user_fullname - неверный формат'));

		return rules;
	}

	// return [
	// 	'refund_tpl_name' : ['str', "/^[0-9a-zA-Zа-яА-Я ]{2,30}/u", true, false, 'refund_tpl_name неверный формат'],
	// 	'user_id' : ['int', "/^[0-9]{1,11}/", true, false, 'user_id не верный формат'],
	// 	'refund_money' : ['int', "/^[0-9]{1,11}/", false, false, 'refund_money неверный формат'],
	// 	'refund_type' : ['enum', ['card', 'account'], true, false, 'refund_type неверный формат'],

	// 	'refund_card' : ['str', "/^[0-9]{16,18}/", false, ['refund_type':'card'], 'refund_card неверный формат'],

	// 	'refund_card_account' : ['str', "/^[0-9]{20}/", false, ['refund_type':'account'], 'refund_card_account неверный формат'],
	// 	'refund_bik' : ['str', "/^[0-9]{9,9}/", false, ['refund_type':'account'], 'refund_bik неверный формат'],
	// 	'refund_inn' : ['str', "/^[0-9]{10,10}/", false, ['refund_type':'account'], 'refund_inn неверный формат'],
	// 	'refund_kpp' : ['str', "/^[0-9]{9,9}/", false, ['refund_type':'account'], 'refund_kpp неверный формат'],

	// 	'refund_firstname' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_firstname неверный формат'],
	// 	'refund_lastname' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_lastname неверный формат'],
	// 	'refund_fathername' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_fathername неверный формат'],
	// 	'refund_fullname' : ['text', false, false, false, 'refund_fullname неверный формат'],

	// 	'refund_reason' : ['text', false, false, false, 'refund_reason неверный формат'],
	// ];
}
