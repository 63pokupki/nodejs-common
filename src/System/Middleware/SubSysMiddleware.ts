import { MainRequest } from '../MainRequest';

import { LogicSys } from '../LogicSys';
import { CacheSys } from '../CacheSys';
import { AccessSys } from '../AccessSys';

/* LEGO ошибок */
export default function SubSysMiddleware(req: MainRequest, response: any, next: any): void {
	req.sys.logicSys = new LogicSys(req); // Система логики
	req.sys.cacheSys = new CacheSys(req); // Система кеширования
	req.sys.accessSys = new AccessSys(req);

	next();
}
