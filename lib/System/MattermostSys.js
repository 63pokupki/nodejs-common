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
        axios_1.default.post(this.req.conf.common.hook_url, msg);
    }
}
exports.MattermostSys = MattermostSys;
//# sourceMappingURL=MattermostSys.js.map