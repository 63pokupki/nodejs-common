"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Системный сервис обработки ошибок
 */
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
    /**
     * Получить глобальный статус выполнения
     *
     * @return boolean
     */
    isOk() {
        return this.ok;
    }
    /**
     * Получить режим окружения
     *
     * @return boolean
     */
    isDev() {
        return this.ifDevMode;
    }
    /**
     *	Декларировать одну возможную ошибку
     *
     * @param keyError
     */
    decl(keyError, infoError = null) {
        this.errorDeclareList[keyError] = infoError;
    }
    /**
     *	Декларация возможных ошибок
     *
     * @param keyErrorList
     */
    declare(keyErrorList) {
        for (let i = 0; i < keyErrorList.length; i++) {
            this.errorDeclareList[keyErrorList[i]] = null;
        }
    }
    /**
     *	Декларация возможных ошибок
     *
     * @param keyErrorList
     */
    declareEx(keyErrorList) {
        Object.assign(this.errorDeclareList, keyErrorList);
    }
    /**
     * Добавляет ошибку в стек
     *
     * @param string kError - ключ ошибки
     * @param string sError - сообщение
     * @return void
     */
    error(kError, sError) {
        this.ok = false; // При любой одной ошибке приложение отдает отрицательный ответ
        this.errorList[kError] = sError;
        if (this.ifDevMode) {
            this.devLogList.push('E:[' + kError + '] - ' + sError);
            console.log('E:[' + kError + '] - ' + sError);
            // Проверка на декларацию ошибок
            if (!(kError in this.errorDeclareList)) {
                this.devWarning(kError, 'Отсутствует декларация ошибки');
            }
        }
    }
    /**
     * Сокращенный вариант
     * Добавляет ошибку в стек (используя в качестве сообщения значение из декларации)
     *
     * @param string kError - ключ ошибки
     * @return void
     */
    err(kError) {
        if (this.errorDeclareList[kError]) {
            this.error(kError, this.errorDeclareList[kError]);
        }
        else {
            this.error(kError, 'Неизвестная ошибка');
            this.devWarning(kError, 'Отсутствует декларация ошибки');
        }
    }
    /**
     * Добавляет ошибку в стек,
     * В dev режиме выводит catch(e) ошибки в консоль
     *
     * @param e // Error exeption
     * @param kError // Ключ ошибки - для тестирования
     * @param sError // Сообщение об ошибке
     */
    errorEx(e, kError, sError) {
        this.ok = false; // При любой одной ошибке приложение отдает отрицательный ответ
        this.errorList[kError] = sError;
        if (this.ifDevMode) {
            this.devLogList.push('E:[' + kError + '] - ' + sError);
            console.log('E:[' + kError + '] - ' + sError);
            console.log('Ошибка - ' + e.name, e.message, e.stack);
            // Проверка на декларацию ошибок
            if (!(kError in this.errorDeclareList)) {
                this.devWarning(kError, 'Отсутствует декларация ошибки');
            }
        }
    }
    /**
     * Добавляет уведомление в стек
     *
     * @param string kNotice - ключ ошибки
     * @param string sNotice - сообщение
     * @return void
     */
    notice(kNotice, sNotice) {
        this.noticeList[kNotice] = sNotice;
    }
    /**
     * Добавляет уведомление для разработки в стек
     *
     * @param string kNotice - ключ ошибки
     * @param string sNotice - сообщение
     * @return void
     */
    devNotice(kNotice, sNotice) {
        if (this.ifDevMode) {
            this.devNoticeList[kNotice] = sNotice;
            this.devLogList.push('N:[' + kNotice + '] - ' + sNotice);
            console.log('N:[' + kNotice + '] - ' + sNotice);
        }
    }
    /**
     * Добавляет предупреждение в стек
     *
     * @param string kWarning - ключ ошибки
     * @param string sWarning - сообщение
     * @return void
     */
    warning(kWarning, sWarning) {
        this.warningList[kWarning] = sWarning;
    }
    /**
     * Добавляет предупреждение для разработки в стек
     * Добавляется информация только в тестовом режиме
     *
     * @param string kWarning - ключ ошибки
     * @param string sWarning - сообщение
     * @return void
     */
    devWarning(kWarning, sWarning) {
        if (this.ifDevMode) {
            this.devWarningList[kWarning] = sWarning;
            this.devLogList.push('W:[' + kWarning + '] - ' + sWarning);
            console.log('W:[' + kWarning + '] - ' + sWarning);
        }
    }
    // ==============================================================
    /**
     * Получить все ошибки
     *
     * @return array|null - возвращаются ошибки (key, val)
     */
    getErrors() {
        return this.errorList;
    }
    /**
     * Получить все декларации для DEV режима
     */
    getDevDeclare() {
        for (let k in this.errorDeclareList) {
            if (this.errorList[k] && !this.errorDeclareList[k]) {
                this.errorDeclareList[k] = this.errorList[k];
            }
        }
        return this.errorDeclareList;
    }
    /**
     * Получить все предупреждения для разработки
     *
     * @return array|null - возвращаются предупреждения (key, val)
     */
    getDevWarning() {
        return this.devWarningList;
    }
    /**
     * Получить все предупреждения для пользователя
     *
     * @return array|null - возвращаются предупреждения (key, val)
     */
    getWarning() {
        return this.warningList;
    }
    /**
     * Получить все уведомления для разработки
     *
     * @return array|null - возвращаются уведомления (key, val)
     */
    getDevNotice() {
        return this.devNoticeList;
    }
    /**
     * Получить все уведомления для пользователя
     *
     * @return array|null - возвращаются уведомления (key, val)
     */
    getNotice() {
        return this.noticeList;
    }
    /**
     * Получить все логи для разработки
     *
     * @return array|null - возвращаются уведомления (key, val)
     */
    getDevLog() {
        return this.devLogList;
    }
}
exports.ErrorSys = ErrorSys;
//# sourceMappingURL=ErrorSys.js.map