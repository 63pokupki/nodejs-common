import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { MainRequest } from './MainRequest';

import { UserSys } from './UserSys';

/**
 * Класс конструктор для тестов
 */
export default class BaseTest {
	public db: any; // База данных основного сайта

	public errorSys: ErrorSys;

	public userSys: UserSys;

	constructor(req: MainRequest) {
		this.db = require('knex')(req.conf.mysql);

		this.errorSys = req.sys.errorSys;
		this.userSys = req.sys.userSys;
	}
}
