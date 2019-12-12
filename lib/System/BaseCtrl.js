"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Базовый контроллер
 */
class BaseCtrl {
    constructor(req, resp) {
        this.req = req;
        this.responseSys = req.sys.responseSys;
        this.errorSys = req.sys.errorSys;
        this.userSys = req.sys.userSys;
        this.resp = resp;
    }
    fClassName() {
        return this.constructor.name;
    }
    /**
     *
     * @param msg - Сообщение
     * @param cbAction - Анонимная функция для вызова действия
     */
    async faAction(msg, cbAction) {
        let out = null;
        if (this.errorSys.isOk()) {
            out = await cbAction();
        }
        else {
            this.resp.status(401);
            this.errorSys.error('init_ctrl', 'Авторизация или активация провалились');
        }
        this.resp.send(this.responseSys.response(out, msg));
    }
}
exports.default = BaseCtrl;
//# sourceMappingURL=BaseCtrl.js.map