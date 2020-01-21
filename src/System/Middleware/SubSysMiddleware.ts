import { MainRequest, initMainRequest } from '../MainRequest';

import { LogicSys } from '../LogicSys';

/* LEGO ошибок */
export default function SubSysMiddleware(req: MainRequest, response: any, next: any) {

    req.sys.logicSys = new LogicSys(req); // Система логики

    next();
}