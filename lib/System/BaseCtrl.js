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
            this.resp.status(401);
            this.errorSys.error('init_ctrl', 'Авторизация или активация провалились');
            throw Error('Авторизация или активация провалились');
        }
        try {
            out = await cbAction();
            this.resp.send(this.responseSys.response(out, msg));
        }
        catch (e) {
            this.errorSys.errorEx(e, 'server_error', 'Ошибка сервера');
            this.resp.status(500);
            throw Error('Ошибка сервера');
        }
    }
}
exports.default = BaseCtrl;
//# sourceMappingURL=BaseCtrl.js.map