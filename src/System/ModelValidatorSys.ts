
// Библиотеки
import * as _ from 'lodash';
const utf8 = require('utf8');


// Глобальные сервисы
import MainRequest from '../System/MainRequest';

// Системные сервисы

import { ErrorSys } from './ErrorSys';


/**
 * Системный сервис валидации данных для моделей
 */
export class ModelValidatorSys {
    protected okResult: boolean; // Статус проверки
    protected abValidOK: any; // поля успешно прошедшие проверку
    protected data: any; // Входящие данные
    protected aResult: any; // Отфильтрованные проверенные данные
    protected aResultType: any;
    protected aMsg: string[]; // Сообщения валидации

	/**
	 * Система регистрации ошибок
	 *
	 * @var Sys\ErrorSys
	 */
    protected errorSys: ErrorSys;

    constructor(req: MainRequest) {
        this.errorSys = req.sys.errorSys;
    }

	/**
	 * Валидирует и экранирует строковое значени
	 *
	 * @param string sKey - ключ в базе данных
	 * @param string sTpl - регулярное выражение по которому проверять
	 * @return boolean
	 */
    protected fValidString(sKey: string, sTpl: RegExp): boolean {

        let bSuccess = false;
        let s = String(this.data[sKey]).trim();

        if ( s || s === '' ) {

            s = utf8.encode(s);

            if (sTpl instanceof RegExp) { // Проверка на регулярное выражение

                if (sTpl.exec(s)) {
                    this.aResult[sKey] = s;

                    bSuccess = true;
                }
            } else {
                this.aResult[sKey] = s;
                bSuccess = true;
            }
        }

        return bSuccess;
    }

	/**
	 * Экранирует текст
	 *
	 * @param string sKey
	 * @return boolean
	 */
    protected fValidText(sKey: string): boolean {

        let bSuccess = false;
        let s = String(this.data[sKey]).trim();

        if ( s || s === '' ) {

            this.aResult[sKey] = s;
            bSuccess = true;

		}

        return bSuccess;
    }

	/**
	 * Валидирует булевую переменную
	 *
	 * @param string sKey
	 * @param string sTpl
	 * @return boolean
	 */
    protected fValidBool(sKey: string): boolean {

        let bSuccess = false;
        let i = Number(this.data[sKey]);

        if (!isNaN(i)) {

            if (i == 0 || i == 1) {

                this.aResult[sKey] = i;
                bSuccess = true;
            } else {
                bSuccess = false;
            }

        }

        return bSuccess;
    }

	/**
	 * Проверяет числовые значения
	 *
	 * @param string sKey
	 * @param string sTpl
	 * @return boolean
	 */
    protected fValidInt(sKey: string): boolean {

        let bSuccess = false;
        let i = Math.round(Number(this.data[sKey]));

        if (!isNaN(i)) {

            this.aResult[sKey] = i;
            bSuccess = true;
        }

        return bSuccess;
    }

	/**
	 * Проверяет числовые значения - 2.22
	 *
	 * @param string sKey
	 * @return boolean
	 */
    protected fValidDecimal(sKey: string): boolean {

        let bSuccess = false;
        let i = parseFloat(Number(this.data[sKey]).toFixed(2));

        if (!isNaN(i)) {

            this.aResult[sKey] = i;
            bSuccess = true;

        }

        return bSuccess;
    }

	/**
	 * Проверка Enum параметров
	 *
	 * @param sKey - ключ значения
	 * @param aEnumList - Список возможных значений
	 */
    protected fValidEnum(sKey: string, aEnumList: any[]) {

        let bSuccess = false;
        let v: any = this.data[sKey];

        if (_.indexOf(aEnumList, v) >= 0) {
            let index = _.indexOf(aEnumList, this.data[sKey]);

            this.aResult[sKey] = aEnumList[index];
            bSuccess = true;
        }

        return bSuccess;
    }

	/**
	 * Экранирует JSON и проверяет
	 * Если это массив конвертирует в JSON
	 *
	 * @param string sKey
	 * @return boolean
	 */
    protected fValidJson(sKey: string): boolean {
        let vJsonValue = this.data[sKey];
        let sJsonValue = '';
        let bSuccess = false;

        if (vJsonValue) {

            // Проверка на массив
            if (_.isObject(vJsonValue)) {
                sJsonValue = JSON.stringify(vJsonValue);
            } else {
                sJsonValue = vJsonValue;
            }

            // Проверка строки на корректный JSON
            try {
                let obj = null;
                obj = JSON.parse(sJsonValue);

                if (obj) {
                    this.aResult[sKey] = sJsonValue;

                    bSuccess = true;
                }
            } catch (e) {
                this.errorSys.errorEx(e, sKey + '_json_parse', sKey + ' - неверный формат json поля');
            }

        }

        return bSuccess;
	}

	/**
	 * Проверяет объект ли это
	 *
	 * @param string sKey
	 * @return boolean
	 */
    protected fValidObject(sKey: string): boolean {

		let bSuccess = false;

        if ( _.isObject(this.data[sKey]) ) {

            this.aResult[sKey] = this.data[sKey];
            bSuccess = true;

        }

        return bSuccess;
    }

	/**
	 * Проверяет массив ли это
	 *
	 * @param string sKey
	 * @return boolean
	 */
    protected fValidArray(sKey: string): boolean {

		let bSuccess = false;

        if ( _.isArray(this.data[sKey]) ) {

            this.aResult[sKey] = this.data[sKey];
            bSuccess = true;

        }

        return bSuccess;
    }

    // ================================================================
    // Логические проверки
    // ================================================================

	/**
	 * Проверяет на больше
	 *
	 * @param string sKey
	 * @param string sTpl
	 * @return boolean
	 */
    protected fValidMore(sKey: string, iVal: number): boolean {

        let bSuccess = false;
        let i = Number(this.aResult[sKey])

        if (!_.isNaN(i)) {
            if (i > iVal) { // Если значение больше - все хорошо
                this.aResult[sKey] = i;
                bSuccess = true;
            }
        }

        return bSuccess;
    }

	/**
	 * Проверяет на меньше
	 *
	 * @param string sKey
	 * @param string sTpl
	 * @return boolean
	 */
    protected fValidLess(sKey: string, iVal: number): boolean {

        let bSuccess = false;
        let i = Number(this.aResult[sKey]);

        if (!_.isNaN(i)) {
            if (i < iVal) { // Если значение меньше - все хорошо
                this.aResult[sKey] = i;
                bSuccess = true;
            }
        }

        return bSuccess;
    }

	/**
	 * Проверяет на макс количесво символов
	 *
	 * @param string sKey
	 * @param string sTpl
	 * @return boolean
	 */
    protected fValidMaxLen(sKey: string, iLen: number): boolean {

        let bSuccess = false;


        if (this.aResult[sKey]) {
            let s = String(this.aResult[sKey]);

            if (s.length <= iLen) { // Если значение меньше - все хорошо
                this.aResult[sKey] = s;
                bSuccess = true;
            }
        }

        if (bSuccess) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Проверяет минимальное количество символов
     *
     * @param string stringKey
     * @param number checkValue
     * @return boolean
     */

    protected fValidMinLen(stringKey: string, checkValue: number): boolean {

        if (this.aResult[stringKey]) {
            const preparedInputString = String(this.aResult[stringKey]);

            if (preparedInputString.length >= checkValue) {
                this.aResult[stringKey] = preparedInputString;

                return true;
            }
        }

        return false;
    }

    // ================================================================

	/**
	 * Получить проверенные отфильтрованные данные в качестве массива
	 *
	 * @return array|null
	 */
	public getResult(): {[key:string]:any}|any{ // Получить проверенные отфильтрованные данные
		return this.aResult;
	}
	public getStatus(){ // Получиь статус проверки
		return this.okResult;
	}
	public getMsg(): string[]{
		return this.aMsg;
	}

	//ФОРМАТ ПРАВИЛА [
	//	key_field :[0:type, 1:condition, 2:required, 3:depend, 4:msg_error]
	//]
	public fValid(aRules:any, data:{[key:string]:any}){ // Проверка данных

		this.data = data;
		this.okResult = true; // [true/false] - Успешно или нет прошла валидация
		this.abValidOK = {};
		this.aResult = {};
		this.aMsg = [];

		_.forEach(aRules, (v, k) => {

			this.abValidOK[k] = true;

			//Подстановка значений по умолчанию, если значения нет
			if( this.okResult && v['def'] && !this.data[k] ){
				this.data[k] = v['def'];
			}

			if( 'error_key' in v ){ // Если указываем ключ ошибки декларируем ее
				let errorKey:any = {};
				errorKey[v['error_key']['key']] = v['error_key']['msg'];

				this.errorSys.declareEx(errorKey);
			}

			//Проверка существования данных
			let bExist = true;
			if( !this.data[k] ){
				bExist = false;
			}

			//Проверка зависимостей
			let bDpend = true;
			if( v['depend'] ){
				this.errorSys.decl('valid_'+k+'_depend', k+' - поле не прошло проверку зависимостей');

				_.forEach(v['depend'], (vDepend, kDepend) => {
					if( this.okResult && this.abValidOK[kDepend] ){
						if( this.abValidOK[kDepend] && this.data[kDepend] ){
							if( !(this.data[kDepend] == vDepend || vDepend == '*') ){

								bDpend = false;
								this.errorSys.error('valid_'+k+'_depend', k+' - поле не прошло проверку зависимостей');

							}
						}
					}//if
				}); //foreach
			}//if

			//Проверка - обязательного поля
			if( v['require'] ){
				this.errorSys.decl('valid_'+k+'_require', k+' - поле обязательно для заполнения');

				if( !this.data[k] ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_require', k+' - поле обязательно для заполнения');
				}
			}

			// Обработка [string] значений
			if( bExist && bDpend && v['type'] == 'str' ){
				this.errorSys.decl('valid_'+k+'_str', v['error']+' Ошибка string = '+this.data[k]);

				if( !this.fValidString(k, v['if']) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_str', v['error']+' Ошибка string = '+this.data[k]);
				}
			}

			// Обработка [boolean] значений
			if( bExist && bDpend && v['type'] == 'boolean' ){
				this.errorSys.decl('valid_'+k+'_bool', v['error']+' Ошибка boolean = '+this.data[k]);

				if( !this.fValidBool(k) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_bool', v['error']+' Ошибка boolean = '+this.data[k]);
				}
			}

			// Обработка [integer] значений
			if( bExist && bDpend && v['type'] == 'int' ){
				this.errorSys.decl('valid_'+k+'_int', v['error']+' Ошибка int = '+this.data[k]);

				if( !this.fValidInt(k) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_int', v['error']+' Ошибка int = '+this.data[k]);
				}
			}

			// Обработка [enum] значений
			if( bExist && bDpend && v['type'] == 'enum' ){
				this.errorSys.decl('valid_'+k+'_enum', v['error']+' Ошибка enum = '+this.data[k]);

				if( !this.fValidEnum(k, v['if']) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_enum', v['error']+' Ошибка enum = '+this.data[k]);
				}
			}

			// Обработка [text] значений
			if( bExist && bDpend && v['type'] == 'text' ){
				this.errorSys.decl('valid_'+k+'_text', v['error']+' Ошибка text = '+this.data[k]);

				if( !this.fValidText(k) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_text', v['error']+' Ошибка text = '+this.data[k]);
				}
			}

			// Обработка [json] значений
			if( bExist && bDpend && v['type'] == 'json' ){
				this.errorSys.decl('valid_'+k+'_json', v['error']+' Ошибка json = '+this.data[k]);

				if( !this.fValidJson(k) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_json', v['error']+' Ошибка json = '+this.data[k]);
				}
			}

			// Обработка [decimal] значений
			if( bExist && bDpend && v['type'] == 'decimal' ){
				this.errorSys.decl('valid_'+k+'_decimal', v['error']+' Ошибка decimal = '+this.data[k]);

				if( !this.fValidDecimal(k) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_decimal', v['error']+' Ошибка decimal = '+this.data[k]);
				}
			}

			// Обработка [object] значений
			if( bExist && bDpend && v['type'] == 'object' ){
				this.errorSys.decl('valid_'+k+'_object', v['error']+' Ошибка object = '+this.data[k]);

				if( !this.fValidObject(k) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_object', v['error']+' Ошибка object = '+this.data[k]);
				}
			}

			// Обработка [array] значений
			if( bExist && bDpend && v['type'] == 'array' ){
				this.errorSys.decl('valid_'+k+'_array', v['error']+' Ошибка array = '+this.data[k]);

				if( !this.fValidArray(k) ){
					this.okResult = false;
					this.abValidOK[k] = false;
					this.errorSys.error('valid_'+k+'_array', v['error']+' Ошибка array = '+this.data[k]);
				}
			}

			// =================================================
			// Логические проверки
			// =================================================

			// Обработка [more] значений - Проверка на больше
			if( bExist && 'more' in v ){
				this.errorSys.decl('valid_'+k+'_more', v['error']+' Число слишком маленькое = '+this.data[k]);

				if( v['type'] == 'int' || v['type'] == 'decimal' ){
					if( !this.fValidMore(k, v['more']) ){
						this.okResult = false;
						this.abValidOK[k] = false;
						this.errorSys.error('valid_'+k+'_more', v['error']+' Число слишком маленькое = '+this.data[k]);
					}
				} else {
					this.errorSys.error('valid_'+k+'_more_no_number', v['error']+' Поле не является числом');
				}
			}

			// Обработка [less] значений - Проверка на меньше
			if( bExist && 'less' in v ){
				this.errorSys.decl('valid_'+k+'_less');

				if( v['type'] == 'int' || v['type'] == 'decimal' ){

					if( !this.fValidLess(k, v['less']) ){
						this.okResult = false;
						this.abValidOK[k] = false;
						this.errorSys.error('valid_'+k+'_less', v['error']+' Число слишком большое = '+this.data[k]);
					}
				} else {
					this.errorSys.error('valid_'+k+'_less_no_number', v['error']+' Поле не является числом');
				}
			}

			// Обработка [max_len] значений - Проверка на большее
			if( bExist && 'max_len' in v ){
				this.errorSys.decl('valid_'+k+'_max_len');
				this.errorSys.decl('valid_'+k+'_max_len_no_string');

				// Проверка является ли поле текстовым
				if( v['type'] == 'text' || v['type'] == 'str' ){
					if( !this.fValidMaxLen(k, v['max_len']) ){

						this.okResult = false;
						this.abValidOK[k] = false;
						this.errorSys.error('valid_'+k+'_max_len', v['error']+' Превышено количество символов = '+this.data[k] );
					}
				} else {
					this.errorSys.error('valid_'+k+'_max_len_no_string', 'Поле не является строкой');
				}
            }

            // Обработка [min_len] значений - Проверка на меньшее
            if (bExist && 'min_len' in v) {
                this.errorSys.decl(`valid_${k}_min_len`);
                this.errorSys.decl(`valid_${k}_min_len_no_string`);

                // Проверка является ли поле текстовым
                if (v.type === 'text' || v.type === 'str') {
                    if (this.fValidMinLen(k, v.min_len)) {
                        this.abValidOK[k] = true;
                    } else {
                        this.okResult = false;
                        this.errorSys.error(
                            `valid_'${k}_min_len`,
                            `${v.error} Количество символов меньше минимального значения = ${this.data[k]}`);
                    }
                } else {
                    this.errorSys.error(`valid_${k}_min_len_no_string`, 'Поле не является строкой');
                }
            }

            // ============================================

			// Кастомная ошибка на поле [error_key]
			if( !this.abValidOK[k] && 'error_key' in v ){ // Вызываем кастомную ошибку, если она произошла и была указана
				this.errorSys.error(v['error_key']['key'], v['error_key']['msg']);
			}



		}); // foreach

		return this.okResult;
	}


}
