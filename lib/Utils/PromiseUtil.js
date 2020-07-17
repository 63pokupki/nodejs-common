"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisify = void 0;
function promisify(someResult) {
    if (someResult instanceof Promise) {
        return someResult;
    }
    return Promise.resolve(someResult);
}
exports.promisify = promisify;
//# sourceMappingURL=PromiseUtil.js.map