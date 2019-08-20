"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utf8 = require('utf8');
class ModelValidatorSys {
    constructor(req) {
        this.errorSys = req.sys.errorSys;
    }
    fValidString(sKey, sTpl) {
        let bSuccess = false;
        let s = String(this.data[sKey]).trim();
        if (s) {
            s = utf8.encode(s);
            if (sTpl instanceof RegExp) {
                if (sTpl.exec(s)) {
                    this.aResult[sKey] = s;
                    bSuccess = true;
                }
            }
            else {
                this.aResult[sKey] = s;
                bSuccess = true;
            }
        }
        return bSuccess;
    }
    fValidText(sKey) {
        let bSuccess = false;
        let s = String(this.data[sKey]).trim();
        if (s) {
            this.aResult[sKey] = s;
            bSuccess = true;
        }
        return bSuccess;
    }
    fValidBool(sKey) {
        let bSuccess = false;
        let i = Number(this.data[sKey]);
        if (!isNaN(i)) {
            if (i == 0 || i == 1) {
                this.aResult[sKey] = i;
                bSuccess = true;
            }
            else {
                bSuccess = false;
            }
        }
        return bSuccess;
    }
    fValidInt(sKey) {
        let bSuccess = false;
        let i = Math.round(Number(this.data[sKey]));
        if (!isNaN(i)) {
            this.aResult[sKey] = i;
            bSuccess = true;
        }
        return bSuccess;
    }
    fValidDecimal(sKey) {
        let bSuccess = false;
        let i = parseFloat(Number(this.data[sKey]).toFixed(2));
        if (!isNaN(i)) {
            this.aResult[sKey] = i;
            bSuccess = true;
        }
        return bSuccess;
    }
    fValidEnum(sKey, aEnumList) {
        let bSuccess = false;
        let v = this.data[sKey];
        if (_.indexOf(aEnumList, v) >= 0) {
            let index = _.indexOf(aEnumList, this.data[sKey]);
            this.aResult[sKey] = aEnumList[index];
            bSuccess = true;
        }
        return bSuccess;
    }
    fValidJson(sKey) {
        let vJsonValue = this.data[sKey];
        let sJsonValue = '';
        let bSuccess = false;
        if (vJsonValue) {
            if (_.isObject(vJsonValue)) {
                sJsonValue = JSON.stringify(vJsonValue);
            }
            else {
                sJsonValue = vJsonValue;
            }
            try {
                let obj = null;
                obj = JSON.parse(sJsonValue);
                if (obj) {
                    this.aResult[sKey] = sJsonValue;
                    bSuccess = true;
                }
            }
            catch (e) {
                this.errorSys.errorEx(e, sKey + '_json_parse', sKey + ' - неверный формат json поля');
            }
        }
        return bSuccess;
    }
    fValidObject(sKey) {
        let bSuccess = false;
        if (_.isObject(this.data[sKey])) {
            this.aResult[sKey] = this.data[sKey];
            bSuccess = true;
        }
        return bSuccess;
    }
    fValidArray(sKey) {
        let bSuccess = false;
        if (_.isArray(this.data[sKey])) {
            this.aResult[sKey] = this.data[sKey];
            bSuccess = true;
        }
        return bSuccess;
    }
    fValidMore(sKey, iVal) {
        let bSuccess = false;
        let i = Number(this.aResult[sKey]);
        if (!_.isNaN(i)) {
            if (i > iVal) {
                this.aResult[sKey] = i;
                bSuccess = true;
            }
        }
        return bSuccess;
    }
    fValidLess(sKey, iVal) {
        let bSuccess = false;
        let i = Number(this.aResult[sKey]);
        if (!_.isNaN(i)) {
            if (i < iVal) {
                this.aResult[sKey] = i;
                bSuccess = true;
            }
        }
        return bSuccess;
    }
    fValidMaxLen(sKey, iLen) {
        let bSuccess = false;
        if (this.aResult[sKey]) {
            let s = String(this.aResult[sKey]);
            if (s.length <= iLen) {
                this.aResult[sKey] = s;
                bSuccess = true;
            }
        }
        if (bSuccess) {
            return true;
        }
        else {
            return false;
        }
    }
    fValidMinLen(stringKey, checkValue) {
        if (this.aResult[stringKey]) {
            const preparedInputString = String(this.aResult[stringKey]);
            if (preparedInputString.length >= checkValue) {
                this.aResult[stringKey] = preparedInputString;
                return true;
            }
        }
        return false;
    }
    getResult() {
        return this.aResult;
    }
    getStatus() {
        return this.okResult;
    }
    getMsg() {
        return this.aMsg;
    }
    fValid(aRules, data) {
        this.data = data;
        this.okResult = true;
        this.abValidOK = {};
        this.aResult = {};
        this.aMsg = [];
        _.forEach(aRules, (v, k) => {
            this.abValidOK[k] = true;
            if (this.okResult && v['def'] && !this.data[k]) {
                this.data[k] = v['def'];
            }
            if ('error_key' in v) {
                let errorKey = {};
                errorKey[v['error_key']['key']] = v['error_key']['msg'];
                this.errorSys.declareEx(errorKey);
            }
            let bExist = true;
            if (!this.data[k]) {
                bExist = false;
            }
            let bDpend = true;
            if (v['depend']) {
                this.errorSys.decl('valid_' + k + '_depend', k + ' - поле не прошло проверку зависимостей');
                _.forEach(v['depend'], (vDepend, kDepend) => {
                    if (this.okResult && this.abValidOK[kDepend]) {
                        if (this.abValidOK[kDepend] && this.data[kDepend]) {
                            if (!(this.data[kDepend] == vDepend || vDepend == '*')) {
                                bDpend = false;
                                this.errorSys.error('valid_' + k + '_depend', k + ' - поле не прошло проверку зависимостей');
                            }
                        }
                    }
                });
            }
            if (v['require']) {
                this.errorSys.decl('valid_' + k + '_require', k + ' - поле обязательно для заполнения');
                if (!this.data[k]) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_require', k + ' - поле обязательно для заполнения');
                }
            }
            if (bExist && bDpend && v['type'] == 'str') {
                this.errorSys.decl('valid_' + k + '_str', v['error'] + ' Ошибка string = ' + this.data[k]);
                if (!this.fValidString(k, v['if'])) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_str', v['error'] + ' Ошибка string = ' + this.data[k]);
                }
            }
            if (bExist && bDpend && v['type'] == 'boolean') {
                this.errorSys.decl('valid_' + k + '_bool', v['error'] + ' Ошибка boolean = ' + this.data[k]);
                if (!this.fValidBool(k)) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_bool', v['error'] + ' Ошибка boolean = ' + this.data[k]);
                }
            }
            if (bExist && bDpend && v['type'] == 'int') {
                this.errorSys.decl('valid_' + k + '_int', v['error'] + ' Ошибка int = ' + this.data[k]);
                if (!this.fValidInt(k)) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_int', v['error'] + ' Ошибка int = ' + this.data[k]);
                }
            }
            if (bExist && bDpend && v['type'] == 'enum') {
                this.errorSys.decl('valid_' + k + '_enum', v['error'] + ' Ошибка enum = ' + this.data[k]);
                if (!this.fValidEnum(k, v['if'])) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_enum', v['error'] + ' Ошибка enum = ' + this.data[k]);
                }
            }
            if (bExist && bDpend && v['type'] == 'text') {
                this.errorSys.decl('valid_' + k + '_text', v['error'] + ' Ошибка text = ' + this.data[k]);
                if (!this.fValidText(k)) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_text', v['error'] + ' Ошибка text = ' + this.data[k]);
                }
            }
            if (bExist && bDpend && v['type'] == 'json') {
                this.errorSys.decl('valid_' + k + '_json', v['error'] + ' Ошибка json = ' + this.data[k]);
                if (!this.fValidJson(k)) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_json', v['error'] + ' Ошибка json = ' + this.data[k]);
                }
            }
            if (bExist && bDpend && v['type'] == 'decimal') {
                this.errorSys.decl('valid_' + k + '_decimal', v['error'] + ' Ошибка decimal = ' + this.data[k]);
                if (!this.fValidDecimal(k)) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_decimal', v['error'] + ' Ошибка decimal = ' + this.data[k]);
                }
            }
            if (bExist && bDpend && v['type'] == 'object') {
                this.errorSys.decl('valid_' + k + '_object', v['error'] + ' Ошибка object = ' + this.data[k]);
                if (!this.fValidObject(k)) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_object', v['error'] + ' Ошибка object = ' + this.data[k]);
                }
            }
            if (bExist && bDpend && v['type'] == 'array') {
                this.errorSys.decl('valid_' + k + '_array', v['error'] + ' Ошибка array = ' + this.data[k]);
                if (!this.fValidArray(k)) {
                    this.okResult = false;
                    this.abValidOK[k] = false;
                    this.errorSys.error('valid_' + k + '_array', v['error'] + ' Ошибка array = ' + this.data[k]);
                }
            }
            if (bExist && 'more' in v) {
                this.errorSys.decl('valid_' + k + '_more', v['error'] + ' Число слишком маленькое = ' + this.data[k]);
                if (v['type'] == 'int' || v['type'] == 'decimal') {
                    if (!this.fValidMore(k, v['more'])) {
                        this.okResult = false;
                        this.abValidOK[k] = false;
                        this.errorSys.error('valid_' + k + '_more', v['error'] + ' Число слишком маленькое = ' + this.data[k]);
                    }
                }
                else {
                    this.errorSys.error('valid_' + k + '_more_no_number', v['error'] + ' Поле не является числом');
                }
            }
            if (bExist && 'less' in v) {
                this.errorSys.decl('valid_' + k + '_less');
                if (v['type'] == 'int' || v['type'] == 'decimal') {
                    if (!this.fValidLess(k, v['less'])) {
                        this.okResult = false;
                        this.abValidOK[k] = false;
                        this.errorSys.error('valid_' + k + '_less', v['error'] + ' Число слишком большое = ' + this.data[k]);
                    }
                }
                else {
                    this.errorSys.error('valid_' + k + '_less_no_number', v['error'] + ' Поле не является числом');
                }
            }
            if (bExist && 'max_len' in v) {
                this.errorSys.decl('valid_' + k + '_max_len');
                this.errorSys.decl('valid_' + k + '_max_len_no_string');
                if (v['type'] == 'text' || v['type'] == 'str') {
                    if (!this.fValidMaxLen(k, v['max_len'])) {
                        this.okResult = false;
                        this.abValidOK[k] = false;
                        this.errorSys.error('valid_' + k + '_max_len', v['error'] + ' Превышено количество символов = ' + this.data[k]);
                    }
                }
                else {
                    this.errorSys.error('valid_' + k + '_max_len_no_string', 'Поле не является строкой');
                }
            }
            if (bExist && 'min_len' in v) {
                this.errorSys.decl(`valid_${k}_min_len`);
                this.errorSys.decl(`valid_${k}_min_len_no_string`);
                if (v.type === 'text' || v.type === 'str') {
                    if (this.fValidMinLen(k, v.min_len)) {
                        this.abValidOK[k] = true;
                    }
                    else {
                        this.okResult = false;
                        this.errorSys.error(`valid_'${k}_min_len`, `${v.error} Количество символов меньше минимального значения = ${this.data[k]}`);
                    }
                }
                else {
                    this.errorSys.error(`valid_${k}_min_len_no_string`, 'Поле не является строкой');
                }
            }
            if (!this.abValidOK[k] && 'error_key' in v) {
                this.errorSys.error(v['error_key']['key'], v['error_key']['msg']);
            }
        });
        return this.okResult;
    }
}
exports.ModelValidatorSys = ModelValidatorSys;
//# sourceMappingURL=ModelValidatorSys.js.map