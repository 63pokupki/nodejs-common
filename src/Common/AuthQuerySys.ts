import { QuerySys } from '@a-a-game-studio/aa-front';
import { MainRequest } from '../System/MainRequest';

/**
 * Запросы к сервису авторизации
 */
export class AuthQuerySys extends QuerySys {
	constructor(req: MainRequest) {
		super();
		this.fConfig({
			baseURL: req.auth.auth_url,
			withCredentials: true,
			timeout: 5000,
		});
	}
}