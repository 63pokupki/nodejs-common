import { ErrorSys } from './ErrorSys';
import { RedisSys } from './RedisSys';
import MainRequest from './MainRequest';
import { ModelValidatorSys } from './ModelValidatorSys';
import { UserSys } from './UserSys';
export default class BaseSQL {
    protected db: any;
    protected redisSys: RedisSys;
    protected modelValidatorSys: ModelValidatorSys;
    protected errorSys: ErrorSys;
    protected userSys: UserSys;
    constructor(req: MainRequest);
}
