import { ErrorSys, ModelRulesC, ModelValidatorSys } from '@a-a-game-studio/aa-components/lib';
import { P63Context } from './P63Context';

import { UserSys } from './UserSys';

/**
 * Система логическая система
 * Логические функции управления приложением
 */
export class LogicSys {
	protected errorSys: ErrorSys;

	protected userSys: UserSys;

	protected ctx: P63Context;

	constructor(ctx: P63Context) {
		this.ctx = ctx;
		this.errorSys = ctx.sys.errorSys;
		this.userSys = ctx.sys.userSys;
	}

	/**
	 * Включить запросы на базу данных
	 */
	fMasterDBOn(): void {
		this.ctx.sys.bMasterDB = true;
	}

	/**
	 * Отключить запросы на мастер базу данных
	 */
	fMasterDBOff(): void {
		this.ctx.sys.bMasterDB = false;
	}

	/**
	 * Включить кеш редиса
	 */
	fCacheOn(): void {
		this.ctx.sys.bCache = true;
	}

	/**
	 * Выключить кеш редиса
	 */
	fCacheOff(): void {
		this.ctx.sys.bCache = false;
	}

	/**
     * Логический блок
     * @param sError - Сообщение об ощибке
     * @param callback - функция содержащая логическую операцию
     */
	async ifOk(sError: string, callback: Function): Promise<any> {
		let out = null;
		if (this.errorSys.isOk()) {
			try {
				out = await callback();
				this.errorSys.devNotice('ifok', sError);
			} catch (e) {
				this.errorSys.errorEx(e, 'ifok', sError);
			}
		}

		return out;
	}

	/**
     * Блок для валидации входных данных
     * Выбрасывает ошибку в случае не правильности данных
     */
	fValidData<RequestT>(vModelRules: ModelRulesC, data: RequestT): RequestT {
		const validator = new ModelValidatorSys(this.errorSys);

		let validData: RequestT = null;
		if (validator.fValid(vModelRules.get(), data)) {
			validData = validator.getResult();
		} else {
			const e: Error = this.errorSys.throwValid('Ошибка входных данных');
			this.errorSys.errorEx(e, 'valid_data', 'Ошибка входных данных');
			throw e;
		}

		return validData;
	}

	/**
     * Блок для выполнения запросов на мастер базу данных
     * @param callback - функция содержащая логическую операцию
     */
	async faQueryMasterDB(sError: string, callback: Function): Promise<any> {
		this.ctx.sys.bMasterDB = true;

		let out = null;
		try {
			out = await callback();
			this.errorSys.devNotice('query_master_db', sError);
		} catch (e) {
			this.errorSys.error('query_master_db', sError);
			throw e;
		}

		this.ctx.sys.bMasterDB = false;

		return out;
	}

	/**
	 * Блок для генерации ошибки без индексирования в API
	 * @param error
	 */
	fThrowNoIndex(error: Error): Error {
		this.ctx.sys.errorSys.error('stop_execute_no_error', error.message);
		return error;
	}
}
