"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = require("./ErrorHandler");
/**
 * Функция рендера страницы
 * @param faCallback - функция контролера
 */
exports.faSendRouter = (faCallback) => {
    return async (req, res, next) => {
        try {
            await faCallback(req, res);
        }
        catch (e) {
            ErrorHandler_1.fErrorHandler(e, req, res, next);
        }
    };
};
/**
 * Системный сервис формирования ответа
 */
class ResponseSys {
    //private mattermostSys:MattermostSys;
    constructor(req) {
        this.req = req;
        this.env = req.conf.common.env;
        if (this.env == 'local' || this.env == 'dev' || this.env == 'test') {
            this.ifDevMode = true;
        }
        else {
            this.ifDevMode = false;
        }
        this.errorSys = req.sys.errorSys;
        /* this.mattermostSys = new MattermostSys(req);
 */
    }
    /**
     * Формирование ответа клиенту
     *
     * @param array|null data
     * @param string sMsg
     * @return array
     */
    response(data, sMsg) {
        let out = {
            'ok': this.errorSys.isOk(),
            'e': !this.errorSys.isOk(),
            'errors': this.errorSys.getErrors(),
            // 'warning' : this.errorSys.getWarning(), // Временно убраны пользовательские предупреждения
            // 'notice' : this.errorSys.getNotice(), // Временно убраны пользовательские предупреждения
            'msg': sMsg,
        };
        /* 	// Отправка ошибок в матермост
            if( !this.errorSys.isOk() ){
                this.mattermostSys.sendMsg();
            } */
        if (this.ifDevMode) { // Выводит информацию для разработчиков и тестировщиков
            out['dev_warning'] = this.errorSys.getDevWarning();
            out['dev_notice'] = this.errorSys.getDevNotice();
            out['dev_declare'] = this.errorSys.getDevDeclare();
            out['dev_log'] = this.errorSys.getDevLog();
        }
        if (this.errorSys.isOk()) {
            out['data'] = data;
        }
        else {
            out['data'] = null;
            out['msg'] = 'Что то пошло не так - обратитесь к администратору';
        }
        return out;
    }
}
exports.ResponseSys = ResponseSys;
//# sourceMappingURL=ResponseSys.js.map