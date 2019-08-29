/**
 * Класс констроирующий правила для одного поля
 */
declare class ModelOneRuleC {
    private aRule;
    constructor(sColumn: string);
    /**
     * [str, int, enum, text] - тип приавила
     *
     * @param string sType
     * @return ModelOneRuleC
     */
    type(sType: string): ModelOneRuleC;
    /**
     * [rgexp<string>, enum(array)] - условие валидации
     *
     * @param mixed if
     * @return ModelOneRuleC
     */
    if(ifType: any): ModelOneRuleC;
    /**
     * [true, false] - обязательное поле?
     *
     * @param boolean bRequire
     * @return ModelOneRuleC
     */
    require(): ModelOneRuleC;
    /**
     * [column] От какого поля зависит
     *
     * @param string sDepend
     * @return ModelOneRuleC
     */
    depend(sDepend: string): ModelOneRuleC;
    /**
     * [текст ошибки] - Сообщение в случае если проверка не прошла
     *
     * @param string sError
     * @return ModelOneRuleC
     */
    error(sError: string): ModelOneRuleC;
    /**
     * [клич ошибки, сообшение ошибки] - Ключ и сообщение ошибки в случае если проверка не прошла
     *
     * @param string sError
     * @return ModelOneRuleC
     */
    errorEx(sKey: string, sError: string): ModelOneRuleC;
    /**
     * Значение по умолчанию
     *
     * @param mixed val
     * @return ModelOneRuleC
     */
    def(val: any): ModelOneRuleC;
    /**
     * Максимальная длинна строки
     *
     * @param [type] iVal
     * @return ModelOneRuleC
     */
    maxLen(iVal: number): ModelOneRuleC;
    /**
     * Минимальная длинна строки
     *
     * @param [type] iVal
     * @return ModelOneRuleC
     */
    minLen(iVal: number): ModelOneRuleC;
    /**
     * Больше
     * @param iVal - Числовое сравнение [больше]
     */
    more(iVal: number): ModelOneRuleC;
    /**
     * Меньше
     * @param iVal - Числовое сравнение [меньше]
     */
    less(iVal: number): ModelOneRuleC;
    /**
     * Получить правило
     *
     * @return array
     */
    get(): {
        [key: string]: any;
    };
    /**
     * Получить название колонки
     *
     * @return string
     */
    getKey(): string;
}
export { ModelOneRuleC };
