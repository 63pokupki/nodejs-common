import MainRequest from '../MainRequest';

import { ResponseSys } from '../ResponseSys';


/* Переводи пост в JSON */
export default function ResponseSysMiddleware(request: MainRequest, response: any, next: any) {

    const responseSys = new ResponseSys(request);
    request.sys.responseSys = responseSys;

    next();
}