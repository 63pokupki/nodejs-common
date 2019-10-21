import { ErrorSys } from "./ErrorSys";
/**
 * Валидатор поля
 */
export declare class FieldValidator {
    errorSys: ErrorSys;
    protected bOk: boolean;
    protected data: any;
    protected sErr: string;
    constructor(errorSys: ErrorSys, data: any);
    protected fErr(sError: string, sMsg: string): void;
    /**
     * Список ошибок
     */
    fGetErrorSys(): ErrorSys;
    /**
     * признак отсутвия ошибок
     */
    fIsOk(): boolean;
    /**
     * Установить валидируемые данные
     * @param data
     */
    fSetData(data: any): FieldValidator;
    /**
     * строка примечание к ошибке
     * @param sErr: string
     */
    fSetErrorString(sErr: string): FieldValidator;
    /**
     * Существование значения
     * @error isNotExist
     */
    fExist(sError?: string): FieldValidator;
    /**
     * Text validator
     *
     * @param string sKey
     * @return boolean
     */
    fText(sError?: string): FieldValidator;
    /**
    * Валидирует булевую переменную
    * @error isNotBool
    * @param string sError: string = 'isNotBool'
    * @return boolean
    */
    fBool(sError?: string): FieldValidator;
    /**
     * Проверяет числовые значения
     * @error isNotInt
     * @param string sKey
     * @param string sTpl
     * @param string sError: string = 'isNotInt'
     * @return boolean
     */
    fInt(sError?: string): FieldValidator;
    /**
     * Проверяет дату
     * @error isNotDate
     * @param string sKey
     * @param string sError: string = 'isNotInt'
     * @return boolean
     */
    fDate(sError?: string): FieldValidator;
    /**
     * Проверяет числовые значения - 2.22
     * @error isNotDecimal
     * @param string sError: string = 'isNotDecimal'
     * @return boolean
     */
    fDecimal(sError?: string): FieldValidator;
    /**
     * Проверяет массив чисел
     * @error isNotArrayNumbers
     * @param string sError: string = 'isNotArrayNumbers'
     * @return boolean
     */
    fArrayNumbers(sError?: string): FieldValidator;
    /**
     * Проверяет на больше
     * @error isNotMoreThan
     * @param iVal: number
     * @param sError: string = 'isNotMoreThan'
     */
    fMore(iVal: number, sError?: string): FieldValidator;
    /**
     * Проверяет на больше
     * @error isNotMoreOrEqualThan
     * @param iVal: number
     */
    fMoreOrEqual(iVal: number, sError?: string): FieldValidator;
    /**
     * Проверяет на меньше
     *
     * @param iVal: number
     * @param sError: string = 'isNotLessThan'
     */
    fLess(iVal: number, sError?: string): FieldValidator;
    /**
     * Проверяет на меньше или равно
     * @error isLessOrEqualThan
     * @param iVal: number
     */
    fLessOrEqual(iVal: number, sError?: string): FieldValidator;
    /**
     * Проверяет на макс количесво символов
     *
     * @param iLen: number
     * @param sError: string = 'moreThanMaxLen'
     */
    fMaxLen(iLen: number, sError?: string): FieldValidator;
    /**
     * Проверяет на минимальное количесво символов
     *
     * @param iLen: number
     * @param sError: string = 'lessThanMinLen'
     */
    fMinLen(iLen: number, sError?: string): FieldValidator;
    /**
     * @error isNotEqual
     * @param Val
     * @param sError: string = 'isNotEqual'
     */
    fEqual(Val: any, sError?: string): FieldValidator;
    /**
     * Данные не должны существовать
     * @error isExist
     * @param sError: string = 'isExist'
     */
    fNotExist(sError?: string): FieldValidator;
    /**
     * Проверка что значение должно быть true
     * @error isNotTrue
     * @param sError: string = 'isNotTrue'
     */
    fTrue(sError?: string): FieldValidator;
    /**
     * Проверка что значение должно быть false
     * @error isNotFalse
     * @param sError: string = 'isNotFalse'
     */
    fFalse(sError?: string): FieldValidator;
    /**
     * Выполнить ф-ю если все OK
     * Не будет корректно работать с асинхронными ф-ми
     * @param fnc: Function
     * @param arg: any[] - аргументы для fnc
     * @param sError: string = 'fncHasError'
     */
    fDoIfOk(fnc: Function, arg?: any[], sError?: string): any;
    /**
     * Выполнить асинхронную ф-ю если все OK
     * @param fnc: Function
     * @param sError: string = 'fncAsyncHasError'
     */
    faDoIfOkAsync(fnc: Function, sError?: string): Promise<any>;
}
