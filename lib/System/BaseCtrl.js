"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * SQL Запросы
 */
class BaseCtrl {
    constructor(req) {
        this.req = req;
        this.responseSys = req.sys.responseSys;
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }
}
exports.default = BaseCtrl;
//# sourceMappingURL=BaseCtrl.js.map