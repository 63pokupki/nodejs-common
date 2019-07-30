"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorSys {
    constructor(req) {
        this.ok = true;
        this.env = req.conf.common.env;
        if (this.env == 'local' || this.env == 'dev') {
            this.ifDevMode = true;
        }
        else {
            this.ifDevMode = false;
        }
        this.errorList = {};
        this.errorDeclareList = {};
        this.devWarningList = {};
        this.warningList = {};
        this.devNoticeList = {};
        this.noticeList = {};
        this.devLogList = [];
    }
    isOk() {
        return this.ok;
    }
    isDev() {
        return this.ifDevMode;
    }
    decl(keyError, infoError = null) {
        this.errorDeclareList[keyError] = infoError;
    }
    declare(keyErrorList) {
        for (let i = 0; i < keyErrorList.length; i++) {
            this.errorDeclareList[keyErrorList[i]] = null;
        }
    }
    declareEx(keyErrorList) {
        Object.assign(this.errorDeclareList, keyErrorList);
    }
    error(kError, sError) {
        this.ok = false;
        this.errorList[kError] = sError;
        if (this.ifDevMode) {
            this.devLogList.push('E:[' + kError + '] - ' + sError);
            console.log('E:[' + kError + '] - ' + sError);
            if (!(kError in this.errorDeclareList)) {
                this.devWarning(kError, 'Отсутствует декларация ошибки');
            }
        }
    }
    err(kError) {
        if (this.errorDeclareList[kError]) {
            this.error(kError, this.errorDeclareList[kError]);
        }
        else {
            this.error(kError, 'Неизвестная ошибка');
            this.devWarning(kError, 'Отсутствует декларация ошибки');
        }
    }
    errorEx(e, kError, sError) {
        this.ok = false;
        this.errorList[kError] = sError;
        if (this.ifDevMode) {
            this.devLogList.push('E:[' + kError + '] - ' + sError);
            console.log('E:[' + kError + '] - ' + sError);
            console.log('Ошибка - ' + e.name, e.message, e.stack);
            if (!(kError in this.errorDeclareList)) {
                this.devWarning(kError, 'Отсутствует декларация ошибки');
            }
        }
    }
    notice(kNotice, sNotice) {
        this.noticeList[kNotice] = sNotice;
    }
    devNotice(kNotice, sNotice) {
        if (this.ifDevMode) {
            this.devNoticeList[kNotice] = sNotice;
            this.devLogList.push('N:[' + kNotice + '] - ' + sNotice);
            console.log('N:[' + kNotice + '] - ' + sNotice);
        }
    }
    warning(kWarning, sWarning) {
        this.warningList[kWarning] = sWarning;
    }
    devWarning(kWarning, sWarning) {
        if (this.ifDevMode) {
            this.devWarningList[kWarning] = sWarning;
            this.devLogList.push('W:[' + kWarning + '] - ' + sWarning);
            console.log('W:[' + kWarning + '] - ' + sWarning);
        }
    }
    getErrors() {
        return this.errorList;
    }
    getDevDeclare() {
        for (let k in this.errorDeclareList) {
            if (this.errorList[k] && !this.errorDeclareList[k]) {
                this.errorDeclareList[k] = this.errorList[k];
            }
        }
        return this.errorDeclareList;
    }
    getDevWarning() {
        return this.devWarningList;
    }
    getWarning() {
        return this.warningList;
    }
    getDevNotice() {
        return this.devNoticeList;
    }
    getNotice() {
        return this.noticeList;
    }
    getDevLog() {
        return this.devLogList;
    }
}
exports.ErrorSys = ErrorSys;
//# sourceMappingURL=ErrorSys.js.map