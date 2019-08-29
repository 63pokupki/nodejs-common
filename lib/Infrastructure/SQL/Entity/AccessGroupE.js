"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Компоненты
const ModelRulesC_1 = require("../../../Components/ModelRulesC");
/**
 * WorldFasa
 *
 * @ORM\Table(name="access_group")
 * @ORM\Entity
 */
class AccessGroupE {
    constructor() {
        //Имя таблицы
        this.NAME = 'access_group';
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
    /**
     * Обновление ключевых записей таблицы
     */
    getRulesUpdate() {
        let rules = new ModelRulesC_1.ModelRulesC();
        rules.set(rules.rule('create_access')
            .type('boolean')
            .error('create_access - неверный формат'));
        rules.set(rules.rule('read_access')
            .type('boolean')
            .error('read_access - неверный формат'));
        rules.set(rules.rule('update_access')
            .type('boolean')
            .error('update_access - неверный формат'));
        rules.set(rules.rule('delete_access')
            .type('boolean')
            .error('delete_access - неверный формат'));
        return rules.get();
    }
    /**
     *  Правила создания записей в таблице
     */
    getRulesInsert() {
        let rules = new ModelRulesC_1.ModelRulesC();
        rules.set(rules.rule('group_id')
            .type('int')
            .error('group_id - неверный формат'));
        rules.set(rules.rule('ctrl_access_id')
            .type('int')
            .error('ctrl_access_id - неверный формат'));
        return rules.get();
    }
}
exports.AccessGroupE = AccessGroupE;
//# sourceMappingURL=AccessGroupE.js.map