"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelRulesC_1 = require("../../../Components/ModelRulesC");
class AccessGroupE {
    constructor() {
        this.NAME = 'access_group';
    }
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