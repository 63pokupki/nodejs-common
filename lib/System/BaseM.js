"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Базовая модель
 */
class BaseM {
    constructor(req) {
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        this.req = req;
    }
}
exports.default = BaseM;
//# sourceMappingURL=BaseM.js.map