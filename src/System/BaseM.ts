import { ErrorSys } from '@a-a-game-studio/aa-components/lib';
import { UserSys } from './UserSys';
import { MainRequest } from './MainRequest';
import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';
import { AccessSys } from './AccessSys';

/**
 * Базовая модель
 */
export default class BaseM {
	public errorSys: ErrorSys;

	public userSys: UserSys;

	public req: MainRequest;

	public logicSys: LogicSys;

	public cacheSys: CacheSys;

	public accessSys: AccessSys;

	constructor(req: MainRequest) {
		this.errorSys = req.sys.errorSys;
		this.userSys = req.sys.userSys;
		this.logicSys = req.sys.logicSys;
		this.cacheSys = req.sys.cacheSys;
		this.req = req;
		this.accessSys = req.sys.accessSys;
	}
}
