"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Компоненты
const ModelRulesC_1 = require("../../../Components/ModelRulesC");
class UserE {
    getRules() {
        let rules = new ModelRulesC_1.ModelRulesC();
        rules.set(rules.rule('user_id')
            .type('int')
            .error('user_id - неверный формат'));
        rules.set(rules.rule('user_email')
            .type('text')
            .error('user_email - неверный формат'));
        rules.set(rules.rule('user_fullname')
            .type('text')
            .error('user_fullname - неверный формат'));
        return rules.get();
    }
}
exports.UserE = UserE;
//Имя таблицы
UserE.NAME = 'phpbb_users';
//# sourceMappingURL=UserE.js.map