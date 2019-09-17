import MainRequest from './MainRequest';

import axios from "axios";
import { ErrorSys } from './ErrorSys';

interface MattermostField{
    short:boolean,
    title:string,
    value:string,
}
interface MattermostMsg{
    attachments: {
        fallback: string,
        color: string,
        text: string,
        title: string,
        fields: MattermostField[];
      }[];
  };

/**
 * Класс для роботы с S3 like
 */
export class MattermostSys {


    protected req: MainRequest;
    protected errorSys: ErrorSys;

    constructor(req: MainRequest) {
        this.req = req;
        this.errorSys = req.sys.errorSys;
    }

    public sendMsg(){

        let arrError:any = this.errorSys.getErrors();
        let msg:MattermostMsg = {
			attachments: [
			  {
				"fallback": "test",
				"color": "#FF8000",
				"text": this.req.originalUrl,
				"title": "Ошибка",
				"fields": [
				],
			  }
			]
        };

        for(let k in arrError){
            let v = arrError[k];

            msg.attachments[0].fields.push({
                short:false,
                title:k,
                value:v,
            })
        }

        axios.post(this.req.conf.common.hook_url, msg);
    }

}