"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
/**
 * Обработчик ошибок выполнения
 * @param err - обязательно instanceof Error()
 * @param req
 * @param res
 * @param next
 */
exports.fErrorHandler = (err, req, res, next) => {
    const mattermostSys = new __1.Mattermost.MattermostSys(req);
    let ifDevMode = false;
    if (req.conf.common.env !== 'prod') {
        ifDevMode = true;
    }
    if (err.name == 'AuthError') {
        res.status(500);
        // req.sys.errorSys.error('AuthError', 'Ошибка авторизации');
    }
    else if (err.name == 'ValidationError') {
        res.status(200);
        req.sys.errorSys.error('ValidationError', 'Ошибка валидации');
    }
    else if (err.name == 'AppError') {
        res.status(500);
        if (req.conf.common.env !== 'local') {
            mattermostSys.sendErrorMsg(req.sys.errorSys, err, err.message);
        }
        if (ifDevMode) {
            console.log('=================================== \r\n', `err.msg: ${err.message}`, '\r\n', 'err.stack: \r\n ', '----------------------------------- \r\n', err.stack, '\r\n', '----------------------------------- \r\n', 'originalUrl:', req.originalUrl, '\r\n', '=================================== \r\n', '\r\n');
        }
    }
    else {
        res.status(500);
        /* у нас в err что-то не то */
        req.sys.errorSys.error('server_error', 'Ошибка сервера');
        mattermostSys.sendErrorMsg(req.sys.errorSys, err, `${String(err)} Кривой формат ошибки`);
    }
    res.send(req.sys.responseSys.response(null, err.message));
};
//# sourceMappingURL=ErrorHandler.js.map