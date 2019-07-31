"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseS {
    constructor(req) {
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        this.req = req;
    }
}
exports.default = BaseS;
//# sourceMappingURL=BaseS.js.map