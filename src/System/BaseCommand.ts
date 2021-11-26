import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { P63Context } from './P63Context';
import { UserSys } from './UserSys';

/**
 * Конструктор для консольных команд
 */
export default class BaseCommand {
	public db: any;

	public errorSys: ErrorSys;

	public userSys: UserSys;

	constructor(ctx: P63Context) {
		this.db = ctx.infrastructure.mysql;

		this.errorSys = ctx.sys.errorSys;
		this.userSys = ctx.sys.userSys;
	}
}
