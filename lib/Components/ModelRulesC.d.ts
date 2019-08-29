import { ModelOneRuleC } from "./ModelOneRuleC";
/** Типы валидации */
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
/**
 * Конструктор правил валидации
 */
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
