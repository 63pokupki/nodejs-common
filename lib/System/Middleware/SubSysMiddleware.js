"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogicSys_1 = require("../LogicSys");
const CacheSys_1 = require("../CacheSys");
/* LEGO ошибок */
function SubSysMiddleware(req, response, next) {
    req.sys.logicSys = new LogicSys_1.LogicSys(req); // Система логики
    req.sys.cacheSys = new CacheSys_1.CacheSys(req); // Система кеширования
    next();
}
exports.default = SubSysMiddleware;
//# sourceMappingURL=SubSysMiddleware.js.map