"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtrlAccessE = void 0;
// Компоненты
const lib_1 = require("@a-a-game-studio/aa-components/lib");
class CtrlAccessE {
    constructor() {
        //Имя таблицы
        this.NAME = 'ctrl_access';
    }
    /**
     * Обновление ключевых записей таблицы
     */
    getRulesUpdate() {
        let rules = new lib_1.ModelRulesC();
        rules.set(rules.rule('alias')
            .typeText()
            .error('alias - неверный формат'));
        rules.set(rules.rule('name')
            .typeText()
            .error('name - неверный формат'));
        rules.set(rules.rule('descript')
            .typeText()
            .error('descript - неверный формат'));
        // rules.set(rules.rule('updated_at')
        //     .type('int')
        //     .def(time())
        //     .error('updated_at - неверный формат')
        // );
        return rules.get();
    }
    /**
     *  Правила создания записей в таблице
     */
    getRulesInsert() {
        let rules = new lib_1.ModelRulesC();
        rules.set(rules.rule('alias')
            .typeText()
            .error('alias - неверный формат'));
        return rules.get();
    }
}
exports.CtrlAccessE = CtrlAccessE;
//# sourceMappingURL=CtrlAccessE.js.map