import { MainRequest } from './MainRequest';

import axios from "axios";
import { ErrorSys } from './ErrorSys';

interface MattermostField {
    short: boolean,
    title: string,
    value: string,
}

interface MattermostMsg {
    attachments: {
        fallback: string,
        color: string,
        text: string,
        title: string,
        fields: MattermostField[];
    }[];
}

/**
 * Класс для работы с MatterMost'ом
 */
export class MattermostSys {
    protected req: MainRequest;
    protected errorSys: ErrorSys;

    constructor(req: MainRequest) {
        this.req = req;
        this.errorSys = req.sys.errorSys;
    }

    /**
     * Отправить сообщение в чат monitoring
     * todo: доделать отправку данных извне
     */
    public sendMonitoringMsg() {

        let arrError: any = this.errorSys.getErrors();
        let msg: MattermostMsg = {
            attachments: [
                {
                    "fallback": "test",
                    "color": "warning",
                    "text": this.req.originalUrl,
                    "title": "Ошибка",
                    "fields": [
                    ],
                }
            ]
        };

        for (let k in arrError) {
            let v = arrError[k];

            msg.attachments[0].fields.push({
                short: false,
                title: k,
                value: v,
            })
        }

        this.send(msg, this.req.conf.common.hook_url_monitoring);
    }

    /**
     * Отправить сообщение об ошибке в чат errors
     * @param errorSys 
     * @param err 
     * @param addMessage 
     */
    public sendErrorMsg(errorSys: ErrorSys, err: Error, addMessage: string) {

        let arrError: any = errorSys.getErrors();

        let msg: MattermostMsg = {
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
            })
        }

        this.send(msg, this.req.conf.common.hook_url_errors);
    }

    /**
     * общий метод для отправки сообщения
     * @param msg
     * @param hook_url
     */
    public send(msg: MattermostMsg, hook_url: string) {
        axios.post(hook_url, msg);
    }
}