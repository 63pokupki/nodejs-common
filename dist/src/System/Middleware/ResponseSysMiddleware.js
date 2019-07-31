"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseSys_1 = require("../ResponseSys");
function ResponseSysMiddleware(request, response, next) {
    const responseSys = new ResponseSys_1.ResponseSys(request);
    request.sys.responseSys = responseSys;
    next();
}
exports.default = ResponseSysMiddleware;
//# sourceMappingURL=ResponseSysMiddleware.js.map