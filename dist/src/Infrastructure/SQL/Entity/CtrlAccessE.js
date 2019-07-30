"use strict";
const ModelRulesC_1 = require('../../../Components/ModelRulesC');
class CtrlAccessE {
    constructor() {
        this.NAME = 'ctrl_access';
    }
    getRulesUpdate() {
        let rules = new ModelRulesC_1.ModelRulesC();
        rules.set(rules.rule('alias')
            .type('text')
            .error('alias - неверный формат'));
        rules.set(rules.rule('name')
            .type('text')
            .error('name - неверный формат'));
        rules.set(rules.rule('descript')
            .type('text')
            .error('descript - неверный формат'));
        return rules.get();
    }
    getRulesInsert() {
        let rules = new ModelRulesC_1.ModelRulesC();
        rules.set(rules.rule('alias')
            .type('text')
            .error('alias - неверный формат'));
        return rules.get();
    }
}
exports.CtrlAccessE = CtrlAccessE;
//# sourceMappingURL=CtrlAccessE.js.map