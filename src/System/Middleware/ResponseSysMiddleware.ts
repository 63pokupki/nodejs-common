import { MainRequest } from '../MainRequest';
import { ResponseSys } from '../ResponseSys';

/* Переводит пост в JSON */
export default function ResponseSysMiddleware(request: MainRequest, response: any, next: any): void {
	const responseSys = new ResponseSys(request);
	request.sys.responseSys = responseSys;

	next();
}
