"use strict";
const ModelOneRuleC_1 = require("./ModelOneRuleC");
var ModelRulesT;
(function (ModelRulesT) {
    ModelRulesT[ModelRulesT["str"] = 'str'] = "str";
    ModelRulesT[ModelRulesT["text"] = 'text'] = "text";
    ModelRulesT[ModelRulesT["boolean"] = 'boolean'] = "boolean";
    ModelRulesT[ModelRulesT["int"] = 'int'] = "int";
    ModelRulesT[ModelRulesT["enum"] = 'enum'] = "enum";
    ModelRulesT[ModelRulesT["json"] = 'json'] = "json";
    ModelRulesT[ModelRulesT["decimal"] = 'decimal'] = "decimal";
    ModelRulesT[ModelRulesT["object"] = 'object'] = "object";
    ModelRulesT[ModelRulesT["array"] = 'array'] = "array";
})(ModelRulesT || (ModelRulesT = {}));
exports.ModelRulesT = ModelRulesT;
class ModelRulesC {
    constructor() {
        this.aRules = {};
    }
    rule(sColumn) {
        return new ModelOneRuleC_1.ModelOneRuleC(sColumn);
    }
    set(oneRule) {
        let k = oneRule.getKey();
        let a = oneRule.get();
        this.aRules[k] = a;
    }
    get() {
        return this.aRules;
    }
}
exports.ModelRulesC = ModelRulesC;
//# sourceMappingURL=ModelRulesC.js.map