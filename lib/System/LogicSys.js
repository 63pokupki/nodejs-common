"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicSys = void 0;
const lib_1 = require("@a-a-game-studio/aa-components/lib");
/**
 * Система логическая система
 * Логические функции управления приложением
 */
class LogicSys {
    constructor(req) {
        this.req = req;
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }
    /**
     * Включить запросы на базу данных
     */
    fMasterDBOn() {
        this.req.sys.bMasterDB = true;
    }
    /**
     * Отключить запросы на мастер базу данных
     */
    fMasterDBOff() {
        this.req.sys.bMasterDB = false;
    }
    /**
     * Включить кеш редиса
     */
    fCacheOn() {
        this.req.sys.bCache = true;
    }
    /**
     * Выключить кеш редиса
     */
    fCacheOff() {
        this.req.sys.bCache = false;
    }
    /**
     * Логический блок
     * @param sError - Сообщение об ощибке
     * @param callback - функция содержащая логическую операцию
     */
    async ifOk(sError, callback) {
        let out = null;
        if (this.errorSys.isOk()) {
            try {
                out = await callback();
                this.errorSys.devNotice('ifok', sError);
            }
            catch (e) {
                this.errorSys.errorEx(e, `ifok`, sError);
            }
        }
        return out;
    }
    /**
     * Блок для валидации входных данных
     * Выбрасывает ошибку в случае не правильности данных
     */
    fValidData(vModelRules, data) {
        const validator = new lib_1.ModelValidatorSys(this.errorSys);
        let validData = null;
        if (validator.fValid(vModelRules.get(), data)) {
            validData = validator.getResult();
        }
        else {
            const e = this.errorSys.throwValid('Ошибка входных данных');
            this.errorSys.errorEx(e, 'valid_data', 'Ошибка входных данных');
            throw e;
        }
        return validData;
    }
    /**
     * Блок для выполнения запросов на мастер базу данных
     * @param callback - функция содержащая логическую операцию
     */
    async faQueryMasterDB(sError, callback) {
        this.req.sys.bMasterDB = true;
        let out = null;
        try {
            out = await callback();
            this.errorSys.devNotice('query_master_db', sError);
        }
        catch (e) {
            this.errorSys.error(`query_master_db`, sError);
            throw e;
        }
        this.req.sys.bMasterDB = false;
        return out;
    }
}
exports.LogicSys = LogicSys;
//# sourceMappingURL=LogicSys.js.map