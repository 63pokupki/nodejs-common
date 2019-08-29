"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Класс констроирующий правила для одного поля
 */
class ModelOneRuleC {
    constructor(sColumn) {
        this.aRule = {};
        this.aRule['key'] = sColumn;
    }
    /**
     * [str, int, enum, text] - тип приавила
     *
     * @param string sType
     * @return ModelOneRuleC
     */
    type(sType) {
        this.aRule['type'] = sType;
        return this;
    }
    /**
     * [rgexp<string>, enum(array)] - условие валидации
     *
     * @param mixed if
     * @return ModelOneRuleC
     */
    if(ifType) {
        this.aRule['if'] = ifType;
        return this;
    }
    /**
     * [true, false] - обязательное поле?
     *
     * @param boolean bRequire
     * @return ModelOneRuleC
     */
    require() {
        this.aRule['require'] = true;
        return this;
    }
    /**
     * [column] От какого поля зависит
     *
     * @param string sDepend
     * @return ModelOneRuleC
     */
    depend(sDepend) {
        this.aRule['depend'] = sDepend;
        return this;
    }
    /**
     * [текст ошибки] - Сообщение в случае если проверка не прошла
     *
     * @param string sError
     * @return ModelOneRuleC
     */
    error(sError) {
        this.aRule['error'] = sError;
        return this;
    }
    /**
     * [клич ошибки, сообшение ошибки] - Ключ и сообщение ошибки в случае если проверка не прошла
     *
     * @param string sError
     * @return ModelOneRuleC
     */
    errorEx(sKey, sError) {
        this.aRule['error_key'] = { key: sKey, msg: sError };
        this.error(sError); // Вывод стандартных ошибок
        return this;
    }
    /**
     * Значение по умолчанию
     *
     * @param mixed val
     * @return ModelOneRuleC
     */
    def(val) {
        this.aRule['def'] = val;
        return this;
    }
    /**
     * Максимальная длинна строки
     *
     * @param [type] iVal
     * @return ModelOneRuleC
     */
    maxLen(iVal) {
        this.aRule['max_len'] = iVal;
        return this;
    }
    /**
     * Минимальная длинна строки
     *
     * @param [type] iVal
     * @return ModelOneRuleC
     */
    minLen(iVal) {
        this.aRule['min_len'] = iVal;
        return this;
    }
    /**
     * Больше
     * @param iVal - Числовое сравнение [больше]
     */
    more(iVal) {
        this.aRule['more'] = iVal;
        return this;
    }
    /**
     * Меньше
     * @param iVal - Числовое сравнение [меньше]
     */
    less(iVal) {
        this.aRule['less'] = iVal;
        return this;
    }
    /**
     * Получить правило
     *
     * @return array
     */
    get() {
        if (!this.aRule['type']) { // Тип
            this.aRule['type'] = false;
        }
        if (!this.aRule['if']) { // Условие
            this.aRule['if'] = false;
        }
        if (!this.aRule['require']) { //  Поле обязательно для заполнения
            this.aRule['require'] = false;
        }
        // if( !this.aRule['max_len'] ){ // Максимальная длинна строки
        // 	this.aRule['max_len'] = false;
        // }
        // if( !this.aRule['more'] ){ // Больше
        // 	this.aRule['more'] = false;
        // }
        // if( !this.aRule['less'] ){ // Больше
        // 	this.aRule['less'] = false;
        // }
        if (!this.aRule['depend']) { // Зависемость от другова поля
            this.aRule['depend'] = false;
        }
        if (!this.aRule['error']) { // Текст об ошибке
            this.aRule['error'] = false;
        }
        return this.aRule;
    }
    /**
     * Получить название колонки
     *
     * @return string
     */
    getKey() {
        return this.aRule['key'];
    }
}
exports.ModelOneRuleC = ModelOneRuleC;
//# sourceMappingURL=ModelOneRuleC.js.map