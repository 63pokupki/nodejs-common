"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Валидатор поля
 */
class FieldValidator {
    constructor(errorSys, data) {
        this.bOk = true;
        this.errorSys = errorSys;
        this.data = data;
        this.sErr = 'Alert! Error is not set for ' + data;
        return this;
    }
    fErr(sError, sMsg) {
        this.bOk = false;
        this.errorSys.error(this.sErr + '.' + sError, sMsg);
    }
    /**
     * Список ошибок
     */
    fGetErrorSys() {
        return this.errorSys;
    }
    /**
     * признак отсутвия ошибок
     */
    fIsOk() {
        return this.bOk;
    }
    /**
     * Установить валидируемые данные
     * @param data
     */
    fSetData(data) {
        this.data = data;
        return this;
    }
    /**
     * строка примечание к ошибке
     * @param sErr: string
     */
    fSetErrorString(sErr) {
        this.sErr = sErr;
        return this;
    }
    /**
     * Существование значения
     * @error isNotExist
     */
    fExist(sError = 'isNotExist') {
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
    fText(sError = 'isNotText') {
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
        }
        catch (e) {
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
    fBool(sError = 'isNotBool') {
        let bSuccess = false;
        try {
            const i = Number(this.data);
            if (!isNaN(i)) {
                if (i == 0 || i == 1) {
                    bSuccess = true;
                    this.data = Boolean(i);
                }
                else {
                    bSuccess = false;
                }
            }
            if (!bSuccess) {
                this.fErr('isNotBool', sError);
            }
        }
        catch (e) {
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
    fInt(sError = 'isNotInt') {
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
        }
        catch (e) {
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
    fDate(sError = 'isNotDate') {
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
                let aKey;
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
        }
        catch (e) {
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
    fDecimal(sError = 'isNotDecimal') {
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
        }
        catch (e) {
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
    fMore(iVal, sError = 'isNotMoreThan') {
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
        }
        catch (e) {
            this.fErr('isNotMoreThan', sError);
        }
        return this;
    }
    /**
     * Проверяет на больше
     * @error isNotMoreOrEqualThan
     * @param iVal: number
     */
    fMoreOrEqual(iVal, sError = 'isNotMoreOrEqualThan') {
        let bSuccess = false;
        try {
            let i = Number(this.data);
            if (!isNaN(i)) {
                if (i >= iVal) { // Если значение больше - все хорошо
                    bSuccess = true;
                }
            }
            if (!bSuccess) {
                this.fErr('isNotMoreOrEqualThan', sError);
            }
        }
        catch (e) {
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
    fLess(iVal, sError = 'isNotLessThan') {
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
        }
        catch (e) {
            this.fErr('isNotLessThan', sError);
        }
        return this;
    }
    /**
     * Проверяет на меньше или равно
     * @error isLessOrEqualThan
     * @param iVal: number
     */
    fLessOrEqual(iVal, sError = 'isLessOrEqualThan') {
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
        }
        catch (e) {
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
    fMaxLen(iLen, sError = 'moreThanMaxLen') {
        let bSuccess = false;
        try {
            let s = String(this.data);
            if (s.length <= iLen) { // Если значение меньше - все хорошо
                bSuccess = true;
            }
            if (!bSuccess) {
                this.fErr('moreThanMaxLen', sError);
            }
        }
        catch (e) {
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
    fMinLen(iLen, sError = 'lessThanMinLen') {
        let bSuccess = false;
        try {
            let s = String(this.data);
            if (s.length >= iLen) { // Если значение минимальное - все хорошо
                bSuccess = true;
            }
            if (!bSuccess) {
                this.fErr('lessThanMinLen', sError);
            }
        }
        catch (e) {
            this.fErr('lessThanMinLen', sError);
        }
        return this;
    }
    /**
     * @error isNotEqual
     * @param Val
     * @param sError: string = 'isNotEqual'
     */
    fEqual(Val, sError = 'isNotEqual') {
        let bSuccess = false;
        try {
            bSuccess = (Val == this.data);
            if (!bSuccess) {
                this.fErr('isNotEqual', sError);
            }
        }
        catch (e) {
            this.fErr('isNotEqual', sError);
        }
        return this;
    }
    /**
     * Данные не должны существовать
     * @error isExist
     * @param sError: string = 'isExist'
     */
    fNotExist(sError = 'isExist') {
        let bSuccess = false;
        try {
            if (!this.data) {
                bSuccess = true;
            }
            if (!bSuccess) {
                this.fErr('isExist', sError);
            }
        }
        catch (e) {
            this.fErr('isExist', sError);
        }
        return this;
    }
    /**
     * Проверка что значение должно быть true
     * @error isNotTrue
     * @param sError: string = 'isNotTrue'
     */
    fTrue(sError = 'isNotTrue') {
        let bSuccess = false;
        try {
            if (this.data == true) {
                bSuccess = true;
            }
            if (!bSuccess) {
                this.fErr('isNotTrue', sError);
            }
        }
        catch (e) {
            this.fErr('isNotTrue', sError);
        }
        return this;
    }
    /**
     * Проверка что значение должно быть false
     * @error isNotFalse
     * @param sError: string = 'isNotFalse'
     */
    fFalse(sError = 'isNotFalse') {
        let bSuccess = false;
        try {
            if (this.data == false) {
                bSuccess = true;
            }
            if (!bSuccess) {
                this.fErr('isNotFalse', sError);
            }
        }
        catch (e) {
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
    fDoIfOk(fnc, arg = [], sError = 'fncHasError') {
        let resp;
        if (this.fIsOk()) {
            try {
                resp = fnc(...arg);
            }
            catch (e) {
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
    async faDoIfOkAsync(fnc, sError = 'fncAsyncHasError') {
        let resp;
        if (this.fIsOk()) {
            try {
                resp = await fnc();
            }
            catch (e) {
                this.fErr('fncAsyncHasError', sError + ': ' + String(e));
            }
        }
        return resp;
    }
}
exports.FieldValidator = FieldValidator;
//# sourceMappingURL=FieldValidator.js.map