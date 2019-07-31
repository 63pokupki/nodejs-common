"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const UserSys_1 = require('../UserSys');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function AuthSysMiddleware(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.headers.apikey) {
            request.sys.apikey = request.headers.apikey;
        }
        else {
            request.sys.apikey = '';
        }
        request.sys.bAuth = false;
        const userSys = new UserSys_1.UserSys(request);
        yield userSys.init();
        request.sys.userSys = userSys;
        next();
    });
};
//# sourceMappingURL=AuthSysMiddleware.js.map