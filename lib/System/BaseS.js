"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Клас для сервисов которые проксируют запросы к базе данных
 * объединяют под различные запросы SQL под единой логикой службы
 * автоматизируют рутинные операции
 */
class BaseS {
    constructor(req) {
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        this.req = req;
    }
}
exports.default = BaseS;
//# sourceMappingURL=BaseS.js.map