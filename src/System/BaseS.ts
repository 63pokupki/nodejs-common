import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { UserSys } from './UserSys';

import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';
import { P63Context } from './P63Context';

/**
 * Класс для сервисов которые проксируют запросы к базе данных
 * объединяют под различные запросы SQL под единой логикой службы
 * автоматизируют рутинные операции
 */
export default class BaseS {
	public errorSys: ErrorSys;

	public userSys: UserSys;

	public ctx: P63Context;

	public logicSys: LogicSys;

	public cacheSys: CacheSys;

	constructor(ctx: P63Context) {
		this.errorSys = ctx.sys.errorSys;
		this.userSys = ctx.sys.userSys;
		this.logicSys = ctx.sys.logicSys;
		this.cacheSys = ctx.sys.cacheSys;
		this.ctx = ctx;
	}
}
