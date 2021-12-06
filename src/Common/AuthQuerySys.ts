import { QuerySys } from '@a-a-game-studio/aa-front';

/**
 * Запросы к сервису авторизации
 */
export class AuthQuerySys extends QuerySys {
	constructor(authUrl: string) {
		super();
		this.fConfig({
			baseURL: authUrl,
			withCredentials: true,
			timeout: 5000,
		});
	}
}