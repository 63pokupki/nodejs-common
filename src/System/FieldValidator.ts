import { ErrorSys } from "./ErrorSys";

/**
 * Валидатор поля
 */
export class FieldValidator {

    public errorSys: ErrorSys;

    protected bOk: boolean = true;
    protected data: any;
    protected sErr: string;


    constructor(errorSys: ErrorSys, data: any) {
        this.errorSys = errorSys;
        this.data = data;
        this.sErr = 'Alert! Error is not set for ' + data;
        return this;
    }

    protected fErr(sError: string, sMsg: string) {
        this.bOk = false;
        this.errorSys.error(this.sErr + '.' + sError, sMsg);
    }

    /**
     * Список ошибок
     */
    public fGetErrorSys(): ErrorSys {
        return this.errorSys;
    }

    /**
     * признак отсутвия ошибок
     */
    public fIsOk(): boolean {
        return this.bOk;
    }

    /**
     * Установить валидируемые данные
     * @param data 
     */
    public fSetData(data: any): FieldValidator {
        this.data = data;
        return this;
    }


    /**
     * строка примечание к ошибке
     * @param sErr: string 
     */
    public fSetErrorString(sErr: string): FieldValidator {
        this.sErr = sErr;
        return this;
    }

    /**
     * Существование значения
     * @error isNotExist
     */
    public fExist(sError: string = 'isNotExist'): FieldValidator {
        if (!this.data) {
            this.fErr('isNotExist', sError);
        }
        return this;
    }

    /**
	 * Text validator
	 *
	 * @param string sKey
	 * @return boolean
	 */
    public fText(sError: string = 'isNotText'): FieldValidator {

        let bSuccess = false;

        try {
            /* if string is not empty */
            const s = String(this.data).trim();

            if (s) {
                bSuccess = true;
                this.data = s;
            }

            /* if string is empty */
            if (this.data == '') {
                bSuccess = true;
            }

            if (!bSuccess) {
                this.fErr('isNotText', sError);
            }
        } catch (e) {
            this.fErr('isNotText', sError);
        }

        return this;
    }


    /**
    * Валидирует булевую переменную
    * @error isNotBool
    * @param string sError: string = 'isNotBool'
    * @return boolean
    */
    public fBool(sError: string = 'isNotBool'): FieldValidator {

        let bSuccess = false;
        try {
            const i = Number(this.data);

            if (!isNaN(i)) {
                if (i == 0 || i == 1) {
                    bSuccess = true;
                    this.data = Boolean(i);
                } else {
                    bSuccess = false;
                }
            }

            if (!bSuccess) {
                this.fErr('isNotBool', sError);
            }

        } catch (e) {
            this.fErr('isNotBool', sError);
        }

        return this;
    }

	/**
	 * Проверяет числовые значения
     * @error isNotInt
	 * @param string sKey
	 * @param string sTpl
	 * @param string sError: string = 'isNotInt'
	 * @return boolean
	 */
    public fInt(sError: string = 'isNotInt'): FieldValidator {

        let bSuccess = false;
        let i = Math.round(Number(this.data));
        try {
            if (!isNaN(i)) {
                bSuccess = true;
                this.data = i;
            }

            if (!bSuccess) {
                this.fErr('isNotInt', sError);
            }

        } catch (e) {
            this.fErr('isNotInt', sError);
        }

        return this;
    }

	/**
	 * Проверяет дату
	 * @error isNotDate
	 * @param string sKey
	 * @param string sError: string = 'isNotInt'
	 * @return boolean
	 */
    public fDate(sError: string = 'isNotDate'): FieldValidator {

        let dateformat = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
        let bSuccess = false;
        try {
            // Match the date format through regular expression
            if (Boolean(this.data.match(dateformat))) {
                //Test which seperator is used '/' or '-'
                let opera1 = this.data.split('/');
                let opera2 = this.data.split('-');
                let lopera1 = opera1.length;
                let lopera2 = opera2.length;
                // Extract the string into month, date and year
                let aKey: any[];
                if (lopera1 > 1) {
                    aKey = this.data.split('/');
                }
                else if (lopera2 > 1) {
                    aKey = this.data.split('-');
                }
                let dd = parseInt(aKey[2]);
                let mm = parseInt(aKey[1]);
                let yy = parseInt(aKey[0]);
                // Create list of days of a month [assume there is no leap year by default]
                let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (mm == 1 || mm > 2) {
                    if (dd > ListofDays[mm - 1]) {
                        bSuccess = false;
                    }
                }
                if (mm == 2) {
                    let lyear = false;
                    if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                        lyear = true;
                    }
                    if ((lyear == false) && (dd >= 29)) {
                        bSuccess = false;
                    }
                    if ((lyear == true) && (dd > 29)) {
                        bSuccess = false;
                    }
                }
                bSuccess = true;
            }
            else {
                bSuccess = false;
            }

            if (!bSuccess) {
                this.fErr('isNotDate', sError);
            }
        } catch (e) {
            this.fErr('isNotDate', sError);
        }

        return this;

    }

	/**
	 * Проверяет числовые значения - 2.22
	 * @error isNotDecimal
	 * @param string sError: string = 'isNotDecimal'
	 * @return boolean
	 */
    public fDecimal(sError: string = 'isNotDecimal'): FieldValidator {

        let bSuccess = false;
        try {
            let i = parseFloat(Number(this.data).toFixed(2));

            if (!isNaN(i)) {
                this.data = i;
                bSuccess = true;
            }

            if (!bSuccess) {
                this.fErr('isNotDecimal', sError);
            }

        } catch (e) {
            this.fErr('isNotDecimal', sError);
        }

        return this;
    }


    // ================================================================
    // Логические проверки
    // ================================================================

	/**
	 * Проверяет на больше
	 * @error isNotMoreThan
	 * @param iVal: number
	 * @param sError: string = 'isNotMoreThan'
	 */
    public fMore(iVal: number, sError: string = 'isNotMoreThan'): FieldValidator {

        let bSuccess = false;
        try {
            let i = Number(this.data);

            if (!isNaN(i)) {
                if (i > iVal) { // Если значение больше - все хорошо
                    bSuccess = true;
                }
            }

            if (!bSuccess) {
                this.fErr('isNotMoreThan', sError);
            }

        } catch (e) {
            this.fErr('isNotMoreThan', sError);
        }

        return this;


    }

	/**
	 * Проверяет на больше
	 * @error isNotMoreOrEqualThan
	 * @param iVal: number
	 */
    public fMoreOrEqual(iVal: number, sError: string = 'isNotMoreOrEqualThan'): FieldValidator {

        let bSuccess = false;

        try {
            let i = Number(this.data)

            if (!isNaN(i)) {
                if (i >= iVal) { // Если значение больше - все хорошо
                    bSuccess = true;
                }
            }

            if (!bSuccess) {
                this.fErr('isNotMoreOrEqualThan', sError);
            }

        } catch (e) {
            this.fErr('isNotMoreOrEqualThan', sError);
        }

        return this;
    }

	/**
	 * Проверяет на меньше
	 *
	 * @param iVal: number
	 * @param sError: string = 'isNotLessThan'
	 */
    public fLess(iVal: number, sError: string = 'isNotLessThan'): FieldValidator {

        let bSuccess = false;

        try {
            let i = Number(this.data);

            if (!isNaN(i)) {
                if (i < iVal) { // Если значение меньше - все хорошо
                    bSuccess = true;
                }
            }

            if (!bSuccess) {
                this.fErr('isNotLessThan', sError);
            }

        } catch (e) {
            this.fErr('isNotLessThan', sError);
        }

        return this;
    }

	/**
	 * Проверяет на меньше или равно
	 * @error isLessOrEqualThan
	 * @param iVal: number
	 */
    public fLessOrEqual(iVal: number, sError: string = 'isLessOrEqualThan'): FieldValidator {

        let bSuccess = false;

        try {
            let i = Number(this.data);

            if (!isNaN(i)) {
                if (i <= iVal) { // Если значение меньше - все хорошо
                    bSuccess = true;
                }
            }

            if (!bSuccess) {
                this.fErr('isLessOrEqualThan', sError);
            }

        } catch (e) {
            this.fErr('isLessOrEqualThan', sError);
        }

        return this;
    }

	/**
	 * Проверяет на макс количесво символов
	 *
	 * @param iLen: number
	 * @param sError: string = 'moreThanMaxLen'
	 */
    public fMaxLen(iLen: number, sError: string = 'moreThanMaxLen'): FieldValidator {

        let bSuccess = false;

        try {
            let s = String(this.data);

            if (s.length <= iLen) { // Если значение меньше - все хорошо
                bSuccess = true;
            }

            if (!bSuccess) {
                this.fErr('moreThanMaxLen', sError);
            }

        } catch (e) {
            this.fErr('moreThanMaxLen', sError);
        }

        return this;

    }

	/**
	 * Проверяет на минимальное количесво символов
	 *
	 * @param iLen: number
	 * @param sError: string = 'lessThanMinLen'
	 */
    public fMinLen(iLen: number, sError: string = 'lessThanMinLen'): FieldValidator {

        let bSuccess = false;

        try {
            let s = String(this.data);

            if (s.length >= iLen) { // Если значение минимальное - все хорошо
                bSuccess = true;
            }

            if (!bSuccess) {
                this.fErr('lessThanMinLen', sError);
            }

        } catch (e) {
            this.fErr('lessThanMinLen', sError);
        }

        return this;

    }

    /**
     * @error isNotEqual
     * @param Val 
     * @param sError: string = 'isNotEqual'
     */
    public fEqual(Val: any, sError: string = 'isNotEqual'): FieldValidator {

        let bSuccess = false;

        try {
            bSuccess = (Val == this.data);

            if (!bSuccess) {
                this.fErr('isNotEqual', sError);
            }

        } catch (e) {
            this.fErr('isNotEqual', sError);
        }

        return this;
    }

    /**
     * Данные не должны существовать
     * @error isExist
     * @param sError: string = 'isExist' 
     */
    public fNotExist(sError: string = 'isExist'): FieldValidator {

        let bSuccess = false;

        try {
            if (!this.data) {
                bSuccess = true;
            }

            if (!bSuccess) {
                this.fErr('isExist', sError);
            }

        } catch (e) {
            this.fErr('isExist', sError);
        }

        return this;
    }

    /**
     * Проверка что значение должно быть true
     * @error isNotTrue
     * @param sError: string = 'isNotTrue' 
     */
    public fTrue(sError: string = 'isNotTrue'): FieldValidator {

        let bSuccess = false;

        try {
            if (this.data == true) {
                bSuccess = true;
            }

            if (!bSuccess) {
                this.fErr('isNotTrue', sError);
            }

        } catch (e) {
            this.fErr('isNotTrue', sError);
        }

        return this;
    }

    /**
     * Проверка что значение должно быть false
     * @error isNotFalse
     * @param sError: string = 'isNotFalse' 
     */
    public fFalse(sError: string = 'isNotFalse'): FieldValidator {

        let bSuccess = false;

        try {
            if (this.data == false) {
                bSuccess = true;
            }

            if (!bSuccess) {
                this.fErr('isNotFalse', sError);
            }

        } catch (e) {
            this.fErr('isNotFalse', sError);
        }

        return this;
    }

    /**
     * Выполнить ф-ю если все OK
     * Не будет корректно работать с асинхронными ф-ми
     * @param fnc: Function
     * @param arg: any[] - аргументы для fnc
     * @param sError: string = 'fncHasError' 
     */
    public fDoIfOk(fnc: Function, arg: any[] = [], sError: string = 'fncHasError'): any {
        let resp;
        if (this.fIsOk()) {
            try {
                resp = fnc(...arg);
            } catch (e) {
                this.fErr('fncHasError', sError);
            }
        }

        return resp;
    }

    /**
     * Выполнить асинхронную ф-ю если все OK
     * @param fnc: Function
     * @param sError: string = 'fncAsyncHasError' 
     */
    public async faDoIfOkAsync(fnc: Function, sError: string = 'fncAsyncHasError'): Promise<any> {

        let resp;
        if (this.fIsOk()) {
            try {
                resp = await fnc();
            } catch (e) {
                this.fErr('fncAsyncHasError', sError + ': ' + String(e));
            }
        }

        return resp;
    }

}