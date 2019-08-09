"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeSpecialChars(str) {
    let aDict = [
        '&nbsp;'
    ];
    let sDict = aDict.join('|');
    var reg1 = new RegExp(sDict);
    return str
        .replace(reg1, '')
        .replace(/(?![a-zA-Zа-яА-я0-9_".:;/|%*-]|\(|\)|\s)./gi, '')
        .replace(/\s+/g, ' ').trim();
}
exports.removeSpecialChars = removeSpecialChars;
//# sourceMappingURL=HelperSys.js.map