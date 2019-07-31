import { ModelOneRuleC } from "./ModelOneRuleC";
declare enum ModelRulesT {
    str = "str",
    text = "text",
    boolean = "boolean",
    int = "int",
    enum = "enum",
    json = "json",
    decimal = "decimal",
    object = "object",
    array = "array"
}
declare class ModelRulesC {
    private aRules;
    constructor();
    rule(sColumn: string): ModelOneRuleC;
    set(oneRule: ModelOneRuleC): void;
    get(): {
        [key: string]: any;
    };
}
export { ModelRulesC, ModelRulesT };
