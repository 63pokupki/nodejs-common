"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Компоненты
const lib_1 = require("@a-a-game-studio/aa-components/lib");
class UserE {
    getRules() {
        let rules = new lib_1.ModelRulesC();
        rules.set(rules.rule('user_id')
            .typeInt()
            .error('user_id - неверный формат'));
        rules.set(rules.rule('user_email')
            .typeText()
            .error('user_email - неверный формат'));
        rules.set(rules.rule('user_fullname')
            .typeText()
            .error('user_fullname - неверный формат'));
        return rules.get();
    }
}
exports.UserE = UserE;
//Имя таблицы
UserE.NAME = 'phpbb_users';
//# sourceMappingURL=UserE.js.map