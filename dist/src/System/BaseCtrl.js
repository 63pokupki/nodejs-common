"use strict";
class BaseCtrl {
    constructor(req) {
        this.req = req;
        this.responseSys = req.sys.responseSys;
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }
}
exports.BaseCtrl = BaseCtrl;
//# sourceMappingURL=BaseCtrl.js.map