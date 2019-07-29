

/**
 * Класс констроирующий правила для одного поля
 */
class ModelOneRuleC {

    private aRule: { [key: string]: any };

    constructor(sColumn: string) {

        this.aRule = {};
        this.aRule['key'] = sColumn;
    }

	/**
	 * [str, int, enum, text] - тип приавила
	 *
	 * @param string sType
	 * @return ModelOneRuleC
	 */
    public type(sType: string): ModelOneRuleC {
        this.aRule['type'] = sType;
        return this;
    }

	/**
	 * [rgexp<string>, enum(array)] - условие валидации
	 *
	 * @param mixed if
	 * @return ModelOneRuleC
	 */
    public if(ifType: any): ModelOneRuleC {
        this.aRule['if'] = ifType;
        return this;
    }

	/**
	 * [true, false] - обязательное поле?
	 *
	 * @param boolean bRequire
	 * @return ModelOneRuleC
	 */
    public require(): ModelOneRuleC {
        this.aRule['require'] = true;
        return this;
    }

	/**
	 * [column] От какого поля зависит
	 *
	 * @param string sDepend
	 * @return ModelOneRuleC
	 */
    public depend(sDepend: string): ModelOneRuleC {
        this.aRule['depend'] = sDepend;
        return this;
    }

	/**
	 * [текст ошибки] - Сообщение в случае если проверка не прошла
	 *
	 * @param string sError
	 * @return ModelOneRuleC
	 */
    public error(sError: string): ModelOneRuleC {
        this.aRule['error'] = sError;
        return this;
	}

	/**
	 * [клич ошибки, сообшение ошибки] - Ключ и сообщение ошибки в случае если проверка не прошла
	 *
	 * @param string sError
	 * @return ModelOneRuleC
	 */
	public errorEx(sKey:string, sError:string): ModelOneRuleC{
		this.aRule['error_key'] = {key:sKey, msg:sError};

		this.error(sError); // Вывод стандартных ошибок
		return this;
	}

	/**
	 * Значение по умолчанию
	 *
	 * @param mixed val
	 * @return ModelOneRuleC
	 */
    public def(val: any): ModelOneRuleC {
        this.aRule['def'] = val;
        return this;
    }

	/**
	 * Максимальная длинна строки
	 *
	 * @param [type] iVal
	 * @return ModelOneRuleC
	 */
    public maxLen(iVal: number): ModelOneRuleC {
        this.aRule['max_len'] = iVal;
        return this;
    }

    /**
     * Минимальная длинна строки
     *
     * @param [type] iVal
     * @return ModelOneRuleC
     */
    public minLen(iVal: number): ModelOneRuleC {
        this.aRule['min_len'] = iVal;

        return this;
    }

    /**
     * Больше
     * @param iVal - Числовое сравнение [больше]
     */
    public more(iVal: number): ModelOneRuleC {
        this.aRule['more'] = iVal;
        return this;
    }

    /**
     * Меньше
     * @param iVal - Числовое сравнение [меньше]
     */
    public less(iVal: number): ModelOneRuleC {
        this.aRule['less'] = iVal;
        return this;
    }

	/**
	 * Получить правило
	 *
	 * @return array
	 */
    public get(): { [key: string]: any } {

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
    public getKey(): string {
        return this.aRule['key'];
    }

    //ФОРМАТ ПРАВИЛА [0:type, 1:condition, 2:required, 3:depend, 4:msg_error]
    // 	'refund_tpl_name' : ['str', "/^[0-9a-zA-Zа-яА-Я ]{2,30}/u", true, false, 'refund_tpl_name неверный формат'],
    // 	'user_id' : ['int', "/^[0-9]{1,11}/", true, false, 'user_id не верный формат'],
    // 	'refund_money' : ['int', "/^[0-9]{1,11}/", false, false, 'refund_money неверный формат'],
    // 	'refund_type' : ['enum', ['card', 'account'], true, false, 'refund_type неверный формат'],

    // 	'refund_card' : ['str', "/^[0-9]{16,18}/", false, ['refund_type':'card'], 'refund_card неверный формат'],

    // 	'refund_card_account' : ['str', "/^[0-9]{20}/", false, ['refund_type':'account'], 'refund_card_account неверный формат'],
    // 	'refund_bik' : ['str', "/^[0-9]{9,9}/", false, ['refund_type':'account'], 'refund_bik неверный формат'],
    // 	'refund_inn' : ['str', "/^[0-9]{10,10}/", false, ['refund_type':'account'], 'refund_inn неверный формат'],
    // 	'refund_kpp' : ['str', "/^[0-9]{9,9}/", false, ['refund_type':'account'], 'refund_kpp неверный формат'],

    // 	'refund_firstname' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_firstname неверный формат'],
    // 	'refund_lastname' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_lastname неверный формат'],
    // 	'refund_fathername' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_fathername неверный формат'],
    // 	'refund_fullname' : ['text', false, false, false, 'refund_fullname неверный формат'],

    // 	'refund_reason' : ['text', false, false, false, 'refund_reason неверный формат'],

}

export { ModelOneRuleC };
