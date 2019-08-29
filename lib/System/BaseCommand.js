"use strict";
// Глобальные сервисы
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Конструктор для консольных комманд
 */
class BaseCommand {
    constructor(req) {
        this.db = require('knex')(req.conf.mysql);
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
    }
}
exports.default = BaseCommand;
//# sourceMappingURL=BaseCommand.js.map