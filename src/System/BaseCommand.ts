import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { MainRequest } from './MainRequest';

import { UserSys } from './UserSys';

/**
 * Конструктор для консольных команд
 */
export default class BaseCommand {
	public db: any;

	public errorSys: ErrorSys;

	public userSys: UserSys;

	constructor(req: MainRequest) {
		this.db = req.infrastructure.mysql;

		this.errorSys = req.sys.errorSys;
		this.userSys = req.sys.userSys;
	}
}
