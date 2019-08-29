"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelOneRuleC_1 = require("./ModelOneRuleC");
/** Типы валидации */
var ModelRulesT;
(function (ModelRulesT) {
    ModelRulesT["str"] = "str";
    ModelRulesT["text"] = "text";
    ModelRulesT["boolean"] = "boolean";
    ModelRulesT["int"] = "int";
    ModelRulesT["enum"] = "enum";
    ModelRulesT["json"] = "json";
    ModelRulesT["decimal"] = "decimal";
    ModelRulesT["object"] = "object";
    ModelRulesT["array"] = "array";
})(ModelRulesT || (ModelRulesT = {}));
exports.ModelRulesT = ModelRulesT;
/**
 * Конструктор правил валидации
 */
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