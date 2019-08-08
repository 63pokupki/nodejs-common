"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseTest {
    constructor(req) {
        this.db = require('knex')(req.conf.mysql);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }
}
exports.default = BaseTest;
//# sourceMappingURL=BaseTest.js.map