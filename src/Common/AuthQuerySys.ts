import { QuerySys } from '@a-a-game-studio/aa-front';

/**
 * Запросы к сервису авторизации
 */
export class AuthQuerySys extends QuerySys {
	constructor(authUrl: string) {
		super();
		this.fConfigWs({
			baseURL: authUrl,
		});
	}
}