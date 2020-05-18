"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Компоненты
const lib_1 = require("@a-a-game-studio/aa-components/lib");
/**
 * Визиты пользователей
 */
class P63UserVisitE {
    /**
     *  Правила создания записей в таблице
     */
    getRulesInsert() {
        let rules = new lib_1.ModelRulesC();
        rules.set(rules.tpl('user_id', true)
            .tplID('user_id - Неверный формат'));
        return rules.get();
    }
}
exports.P63UserVisitE = P63UserVisitE;
//Имя таблицы
P63UserVisitE.NAME = 'p63_user_visit';
//# sourceMappingURL=P63UserVisitE.js.map