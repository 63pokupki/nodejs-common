"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogicSys_1 = require("../LogicSys");
/* LEGO ошибок */
function SubSysMiddleware(req, response, next) {
    req.sys.logicSys = new LogicSys_1.LogicSys(req); // Система логики
    next();
}
exports.default = SubSysMiddleware;
//# sourceMappingURL=SubSysMiddleware.js.map