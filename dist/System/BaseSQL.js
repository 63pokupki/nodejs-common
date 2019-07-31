"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RedisSys_1 = require("./RedisSys");
const ModelValidatorSys_1 = require("./ModelValidatorSys");
class BaseSQL {
    constructor(req) {
        this.db = require('knex')(req.conf.mysql);
        this.redisSys = new RedisSys_1.RedisSys(req.conf.redis);
        this.modelValidatorSys = new ModelValidatorSys_1.ModelValidatorSys(req);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }
}
exports.default = BaseSQL;
//# sourceMappingURL=BaseSQL.js.map