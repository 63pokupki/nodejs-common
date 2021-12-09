import { QuerySys } from '@a-a-game-studio/aa-front';

/**
 * Запросы к сервису авторизации
 */
export class AuthQuerySys extends QuerySys {
	private static instance: AuthQuerySys;

	private constructor(authUrl: string) {
		super();
		this.fConfigWs({
			baseURL: authUrl,
		});
	}

	public static getInstance(authUrl: string): AuthQuerySys {
		if(!AuthQuerySys.instance) {
			AuthQuerySys.instance = new AuthQuerySys(authUrl);
		}
		return AuthQuerySys.instance;
	}
}