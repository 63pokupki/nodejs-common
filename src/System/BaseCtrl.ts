import { ErrorSys } from '@a-a-game-studio/aa-components/lib';


import { ResponseSys } from './ResponseSys';
import { UserSys } from './UserSys';
import { AccessSys } from './AccessSys';
import { P63Context } from './P63Context';

/** Базовый контроллер */
export default class BaseCtrl {
    public ctx: P63Context;

    public errorSys: ErrorSys;

    public userSys: UserSys;

    public responseSys: ResponseSys;

    protected resp: any;

    public accessSys: AccessSys;

    /** init */
    constructor(ctx:P63Context) {
        this.ctx = ctx;
        this.responseSys = ctx.sys.responseSys;
        this.errorSys = ctx.sys.errorSys;
        this.userSys = ctx.sys.userSys;
        this.resp = ctx.res;
        this.accessSys = ctx.sys.accessSys;
    }

    /** init */
    protected fClassName(): string {
        return this.constructor.name;
    }

    /**
     *
     * @param msg - Сообщение
     * @param cbAction - Анонимная функция для вызова действия
     */
    public async faAction(msg: string, cbAction: Function): Promise<void> {
        let out = null;
        if (this.errorSys.isOk()) {
            out = await cbAction();
        } else {
            this.ctx.status(401);
            this.errorSys.error('init_ctrl', 'Авторизация или активация провалились');
        }

        this.ctx.send(
            JSON.stringify(this.responseSys.response(out, msg)),
        );
    }
}