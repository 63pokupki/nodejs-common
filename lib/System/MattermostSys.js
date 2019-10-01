"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
;
/**
 * Класс для роботы с S3 like
 */
class MattermostSys {
    constructor(req) {
        this.req = req;
        this.errorSys = req.sys.errorSys;
    }
    sendMsg() {
        let arrError = this.errorSys.getErrors();
        let msg = {
            attachments: [
                {
                    "fallback": "test",
                    "color": "#FF8000",
                    "text": this.req.originalUrl,
                    "title": "Ошибка",
                    "fields": [],
                }
            ]
        };
        for (let k in arrError) {
            let v = arrError[k];
            msg.attachments[0].fields.push({
                short: false,
                title: k,
                value: v,
            });
        }
        this.send(msg);
    }
    /**
     * Отправить ошибку
     * @param errorSys
     * @param err
     * @param addMessage
     */
    sendErrorMsg(errorSys, err, addMessage) {
        let arrError = errorSys.getErrors();
        let msg = {
            attachments: [
                {
                    "fallback": "test",
                    "color": "danger",
                    "text": ':boom: Apikey: ' + this.req.sys.apikey,
                    "title": ":trollface:  Ошибка на " + this.req.conf.common.env,
                    "fields": [
                        {
                            short: true,
                            title: ':link: URL',
                            value: this.req.originalUrl,
                        },
                        {
                            short: true,
                            title: ':zap: Сообщение',
                            value: addMessage,
                        },
                        {
                            short: false,
                            title: ':bangbang: stack',
                            value: err.stack,
                        },
                        {
                            short: false,
                            title: ':warning: request body',
                            value: this.req.body,
                        },
                    ],
                }
            ]
        };
        for (let k in arrError) {
            let v = arrError[k];
            msg.attachments[0].fields.push({
                short: true,
                title: k,
                value: v,
            });
        }
        this.send(msg);
    }
    /**
     * отправить сообщение
     * @param msg
     */
    send(msg) {
        axios_1.default.post(this.req.conf.common.hook_url, msg);
    }
}
exports.MattermostSys = MattermostSys;
//# sourceMappingURL=MattermostSys.js.map