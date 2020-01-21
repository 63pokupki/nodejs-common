"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Класс для сервисов которые проксируют запросы к базе данных
 * объединяют под различные запросы SQL под единой логикой службы
 * автоматизируют рутинные операции
 */
class BaseS {
    constructor(req) {
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        this.logicSys = req.sys.logicSys;
        this.req = req;
    }
}
exports.default = BaseS;
//# sourceMappingURL=BaseS.js.map