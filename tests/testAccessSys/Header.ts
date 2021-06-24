import * as System from '../../lib';
import { initMainRequest } from '../../src/System/MainRequest';
import Knex = require('knex');
import { UserSys } from '../../src';
const config = require('./../config');
import { CacheSys } from '../../src/System/CacheSys';

// ====================
// данные для проверки
// ====================
export const idUser = 538193; // ид пользователя
export const org_id = 1; // ид организации к роуту которой проверяется доступ
export const ctrlName = 'statement'; // название контроллера из таблицы ctrl_access
export const route = '/access-test/check' // url проверяемого роута req.path в экспрессе


// создание объекта реквеста
const createReq = async () => {
	const mainRequest = initMainRequest(config);
	mainRequest.path = route;
	mainRequest.infrastructure.mysql = Knex(config.mysql);
	mainRequest.infrastructure.mysqlMaster = Knex(config.mysql);
	mainRequest.infrastructure.redis = new System.RedisSys(config.redis);
	mainRequest.sys.cacheSys = new CacheSys(mainRequest);
	mainRequest.sys.userSys = new UserSys(mainRequest);
	mainRequest.sys.userSys.idUser = idUser;
	return mainRequest;

}

export const mainRequest = createReq();


