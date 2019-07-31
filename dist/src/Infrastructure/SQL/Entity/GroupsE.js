"use strict";
const ModelRulesC_1 = require('../../../Components/ModelRulesC');
class GroupsE {
    constructor() {
        this.NAME = 'phpbb_groups';
    }
    getRulesUpdate() {
        let rules = new ModelRulesC_1.ModelRulesC();
        rules.set(rules.rule('alias')
            .type('text')
            .error('alias - неверный формат'));
        rules.set(rules.rule('group_name')
            .type('text')
            .error('group_name - неверный формат'));
        rules.set(rules.rule('group_desc')
            .type('text')
            .error('group_desc - неверный формат'));
        rules.set(rules.rule('group_type')
            .type('int')
            .error('group_type - неверный формат'));
        return rules.get();
    }
}
exports.GroupsE = GroupsE;
//# sourceMappingURL=GroupsE.js.map