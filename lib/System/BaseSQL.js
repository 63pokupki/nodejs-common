"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelValidatorSys_1 = require("./ModelValidatorSys");
class BaseSQL {
    constructor(req) {
        this.modelValidatorSys = new ModelValidatorSys_1.ModelValidatorSys(req);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        if (req.infrastructure.mysql) {
            this.db = req.infrastructure.mysql;
        }
        else {
            this.errorSys.error('db_no_connection', 'Отсутствует подключение к mysql');
        }
        if (req.infrastructure.redis) {
            this.redisSys = req.infrastructure.redis;
        }
        else {
            this.errorSys.error('db_redis', 'Отсутствует подключение к redis');
        }
    }
}
exports.default = BaseSQL;
//# sourceMappingURL=BaseSQL.js.map