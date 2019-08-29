"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Очистить пробельные символы
 */
function removeSpecialChars(str) {
    let aDict = [
        '&nbsp;'
    ];
    let sDict = aDict.join('|');
    var reg1 = new RegExp(sDict);
    return str
        .replace(reg1, '') // Удаление кодированных символов
        .replace(/(?![a-zA-Zа-яА-я0-9_".:;/|%*-]|\(|\)|\s)./gi, '') // Разрешенные символы
        .replace(/\s+/g, ' ').trim(); // Удаление пробельных символов
}
exports.removeSpecialChars = removeSpecialChars;
//# sourceMappingURL=HelperSys.js.map