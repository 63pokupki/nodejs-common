"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
/**
 * Класс для работы с MatterMost'ом
 */
class MattermostSys {
    constructor(req) {
        this.req = req;
        this.errorSys = req.sys.errorSys;
    }
    /**
     * Отправить сообщение в чат monitoring
     * todo: доделать отправку данных извне
     */
    sendMonitoringMsg() {
        let arrError = this.errorSys.getErrors();
        let msg = {
            attachments: [
                {
                    "fallback": "test",
                    "color": "warning",
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
        this.send(msg, this.req.conf.common.hook_url_monitoring);
    }
    /**
     * Отправить сообщение об ошибке в чат errors
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
                    "text": ':boom: :trollface: Apikey: ' + this.req.sys.apikey,
                    "title": "Ошибка на " + this.req.conf.common.env,
                    "fields": [
                        {
                            short: true,
                            title: 'URL',
                            value: ':link: ' + this.req.originalUrl,
                        },
                        {
                            short: true,
                            title: 'Сообщение',
                            value: ':zap: ' + addMessage,
                        },
                        {
                            short: false,
                            title: 'stack',
                            value: ':bangbang: ' + err.stack,
                        },
                        {
                            short: false,
                            title: 'request body',
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
        this.send(msg, this.req.conf.common.hook_url_errors);
    }
    /**
     * Отправить сообщение по мониторингу RabbitMQ
     * @param ixParam - key = очередь, val = количество картинок
     */
    sendMonitoringRabbitQueue(ixParam) {
        let msg = {
            attachments: [
                {
                    "fallback": "test",
                    "color": "info",
                    "text": ':boom: :trollface: RabbitMQ:',
                    "title": "Мониторинг на " + this.req.conf.common.env,
                    "fields": [
                        {
                            short: true,
                            title: 'URL',
                            value: ':link: ' + this.req.originalUrl,
                        },
                    ],
                }
            ]
        };
        for (let k in ixParam) {
            let v = ixParam[k];
            msg.attachments[0].fields.push({
                short: true,
                title: k,
                value: v,
            });
        }
        this.send(msg, this.req.conf.common.hook_url_monitoring);
    }
    /**
     * общий метод для отправки сообщения
     * @param msg
     * @param hook_url
     */
    send(msg, hook_url) {
        axios_1.default.post(hook_url, msg);
    }
}
exports.MattermostSys = MattermostSys;
//# sourceMappingURL=MattermostSys.js.map