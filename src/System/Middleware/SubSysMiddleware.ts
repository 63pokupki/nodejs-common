import { MainRequest, initMainRequest } from '../MainRequest';

import { LogicSys } from '../LogicSys';
import { CacheSys } from '../CacheSys';

/* LEGO ошибок */
export default function SubSysMiddleware(req: MainRequest, response: any, next: any) {
	req.sys.logicSys = new LogicSys(req); // Система логики
	req.sys.cacheSys = new CacheSys(req); // Система кеширования

	next();
}
