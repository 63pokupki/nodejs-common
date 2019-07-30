"use strict";
const RedisSys_1 = require('./RedisSys');
const ModelValidatorSys_1 = require('./ModelValidatorSys');
class BaseSQL {
    constructor(req) {
        this.db = require('knex')(req.conf.mysql);
        this.redisSys = new RedisSys_1.RedisSys(req.conf.redis);
        this.modelValidatorSys = new ModelValidatorSys_1.ModelValidatorSys(req);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseSQL;
//# sourceMappingURL=BaseSQL.js.map