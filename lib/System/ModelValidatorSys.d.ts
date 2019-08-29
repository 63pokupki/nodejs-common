import MainRequest from '../System/MainRequest';
import { ErrorSys } from './ErrorSys';
/**
 * Системный сервис валидации данных для моделей
 */
export declare class ModelValidatorSys {
    protected okResult: boolean;
    protected abValidOK: any;
    protected data: any;
    protected aResult: any;
    protected aResultType: any;
    protected aMsg: string[];
    /**
     * Система регистрации ошибок
     *
     * @var Sys\ErrorSys
     */
    protected errorSys: ErrorSys;
    constructor(req: MainRequest);
    /**
     * Валидирует и экранирует строковое значени
     *
     * @param string sKey - ключ в базе данных
     * @param string sTpl - регулярное выражение по которому проверять
     * @return boolean
     */
    protected fValidString(sKey: string, sTpl: RegExp): boolean;
    /**
     * Экранирует текст
     *
     * @param string sKey
     * @return boolean
     */
    protected fValidText(sKey: string): boolean;
    /**
     * Валидирует булевую переменную
     *
     * @param string sKey
     * @param string sTpl
     * @return boolean
     */
    protected fValidBool(sKey: string): boolean;
    /**
     * Проверяет числовые значения
     *
     * @param string sKey
     * @param string sTpl
     * @return boolean
     */
    protected fValidInt(sKey: string): boolean;
    /**
     * Проверяет числовые значения - 2.22
     *
     * @param string sKey
     * @return boolean
     */
    protected fValidDecimal(sKey: string): boolean;
    /**
     * Проверка Enum параметров
     *
     * @param sKey - ключ значения
     * @param aEnumList - Список возможных значений
     */
    protected fValidEnum(sKey: string, aEnumList: any[]): boolean;
    /**
     * Экранирует JSON и проверяет
     * Если это массив конвертирует в JSON
     *
     * @param string sKey
     * @return boolean
     */
    protected fValidJson(sKey: string): boolean;
    /**
     * Проверяет объект ли это
     *
     * @param string sKey
     * @return boolean
     */
    protected fValidObject(sKey: string): boolean;
    /**
     * Проверяет массив ли это
     *
     * @param string sKey
     * @return boolean
     */
    protected fValidArray(sKey: string): boolean;
    /**
     * Проверяет на больше
     *
     * @param string sKey
     * @param string sTpl
     * @return boolean
     */
    protected fValidMore(sKey: string, iVal: number): boolean;
    /**
     * Проверяет на меньше
     *
     * @param string sKey
     * @param string sTpl
     * @return boolean
     */
    protected fValidLess(sKey: string, iVal: number): boolean;
    /**
     * Проверяет на макс количесво символов
     *
     * @param string sKey
     * @param string sTpl
     * @return boolean
     */
    protected fValidMaxLen(sKey: string, iLen: number): boolean;
    /**
     * Проверяет минимальное количество символов
     *
     * @param string stringKey
     * @param number checkValue
     * @return boolean
     */
    protected fValidMinLen(stringKey: string, checkValue: number): boolean;
    /**
     * Получить проверенные отфильтрованные данные в качестве массива
     *
     * @return array|null
     */
    getResult(): {
        [key: string]: any;
    } | any;
    getStatus(): boolean;
    getMsg(): string[];
    fValid(aRules: any, data: {
        [key: string]: any;
    }): boolean;
}
