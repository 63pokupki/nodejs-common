import { ModelRulesC } from '@a-a-game-studio/aa-components/lib';

/** */
export interface GroupsI {
	group_id?: number;
	alias?: string;
	group_type?: number;
	group_founder_manage?: number;
	group_name?: string;
	group_desc?: string;
	group_desc_bitfield?: string;
	group_desc_options?: number;
	group_desc_uid?: string;
	group_display?: number;
	group_avatar?: string;
	group_avatar_type?: string;
	group_avatar_width?: number;
	group_avatar_height?: number;
	group_rank?: number;
	group_colour?: string;
	group_sig_chars?: number;
	group_receive_pm?: number;
	group_message_limit?: number;
	group_legend?: number;
	group_max_recipients?: number;
	group_skip_auth?: number;
}

/** */
export class GroupsE {
	/** Имя таблицы */
	static NAME = 'phpbb_groups';

	/** Обновление ключевых записей таблицы */
	public getRulesUpdate(): ModelRulesC {
		const rules = new ModelRulesC();

		rules.set(rules.rule('alias')
			.typeText()
			.error('alias - неверный формат'));

		rules.set(rules.rule('group_name')
			.typeText()
			.error('group_name - неверный формат'));

		rules.set(rules.rule('group_desc')
			.typeText()
			.error('group_desc - неверный формат'));

		rules.set(rules.rule('group_type')
			.typeInt()
			.error('group_type - неверный формат'));

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
