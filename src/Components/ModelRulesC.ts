
import {ModelOneRuleC}  from "./ModelOneRuleC"

/** Типы валидации */
enum ModelRulesT{
	str = 'str', // RegExp условие / enum условие(Array)
	text = 'text', // Поле обязательно
	boolean = 'boolean', // Булево значение
	int = 'int', // Целое
	enum = 'enum', // Список значений
	json = 'json', // json поле
	decimal = 'decimal', // float двойной точности 10.00
	object = 'object', // js object {}
	array = 'array', // js array []
}
/**
 * Конструктор правил валидации
 */
class ModelRulesC {

    private aRules:{[key:string]:any};

    constructor(){
		this.aRules = {};
	}

	public rule(sColumn:string):ModelOneRuleC{
		return new ModelOneRuleC(sColumn);
	}

	public set(oneRule:ModelOneRuleC){
		let k = oneRule.getKey();
		let a = oneRule.get();
		this.aRules[k] = a;
	}

	public get(): {[key:string]:any}{
		return this.aRules;
	}

}

export {ModelRulesC, ModelRulesT};