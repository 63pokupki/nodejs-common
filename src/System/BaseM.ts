import { ErrorSys } from '@63pokupki/components/lib';
import { UserSys } from './UserSys';

import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';
import { AccessSys } from './AccessSys';
import { P63Context } from './P63Context';

/**
 * Базовая модель
 */
export default class BaseM {
	public errorSys: ErrorSys;

	public userSys: UserSys;

	public ctx: P63Context;

	public logicSys: LogicSys;

	public cacheSys: CacheSys;

	public accessSys: AccessSys;

	constructor(ctx: P63Context) {
		this.errorSys = ctx.sys.errorSys;
		this.userSys = ctx.sys.userSys;
		this.logicSys = ctx.sys.logicSys;
		this.cacheSys = ctx.sys.cacheSys;
		this.ctx = ctx;
		this.accessSys = ctx.sys.accessSys;
	}
}
