"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
/**
 * задержка на нужное кол-во секунд
 * @param n
 */
function wait(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, n);
    });
}
exports.wait = wait;
//# sourceMappingURL=wait.js.map