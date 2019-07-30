"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const CtrlAccessE_1 = require('../Entity/CtrlAccessE');
const BaseSQL_1 = require('../../../System/BaseSQL');
class CtrlAccessSQL extends BaseSQL_1.default {
    constructor(req) {
        super(req);
    }
    getCtrlAccessByAlias(aliasCtrlAccess) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            let resp = null;
            let sql = '';
            this.errorSys.declare([
                'get_ctrl_access',
                'get_ctrl_access_not_found'
            ]);
            sql = `
            SELECT
                ca.id,
                ca.alias,
                ca.name,
                ca.descript
            FROM ctrl_access ca
            WHERE ca.alias = :alias
            LIMIT 1
        `;
            try {
                resp = (yield this.db.raw(sql, {
                    'alias': aliasCtrlAccess
                }))[0];
            }
            catch (e) {
                ok = false;
                this.errorSys.error('get_ctrl_access', 'Не удалось получить контроль доступа');
            }
            if (ok && resp[0]) {
                resp = resp[0];
            }
            else {
                this.errorSys.error('get_ctrl_access_not_found', 'Не удалось найти контроль доступа');
            }
            return resp;
        });
    }
    getCtrlAccessByID(idCtrlAccess) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            let resp = null;
            this.errorSys.declare([
                'get_ctrl_access',
                'ctrl_access_not_found'
            ]);
            let sql = `
            SELECT
                ca.id,
                ca.alias,
                ca.name,
                ca.descript
            FROM ctrl_access ca
            WHERE ca.id = :id_ctrl_access
            LIMIT 1
        `;
            try {
                resp = (yield this.db.raw(sql, {
                    'id_ctrl_access': idCtrlAccess
                }))[0];
            }
            catch (e) {
                ok = false;
                this.errorSys.error('get_ctrl_access', 'Не удалось получить контроль доступа');
            }
            if (ok && resp.length > 0) {
                resp = resp[0];
            }
            else {
                resp = null;
                ok = false;
                this.errorSys.error('ctrl_access_not_found', 'Контроллер доступа не найден');
            }
            return resp;
        });
    }
    getAllCtrlAccess() {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            let bCache = false;
            let sql = '';
            let resp = null;
            this.errorSys.declare([
                'get_list_ctrl_access'
            ]);
            let sCache = null;
            if (ok) {
                sCache = yield this.redisSys.get("CtrlAccessSQL.getAllCtrlAccess()");
                if (sCache) {
                    bCache = true;
                    this.errorSys.devNotice("cache:CtrlAccessSQL.getAllCtrlAccess()", 'Значение взято из кеша');
                }
            }
            let ctrlAccessList = null;
            if (ok && !bCache) {
                sql = `
                SELECT
                    ca.id,
                    ca.alias,
                    ca.name
                FROM ctrl_access ca
                ;
            `;
                try {
                    ctrlAccessList = (yield this.db.raw(sql))[0];
                }
                catch (e) {
                    ok = false;
                    this.errorSys.error('get_list_ctrl_access', 'Не удалось получить группы пользователя');
                }
            }
            if (ok && !bCache) {
                this.redisSys.set("CtrlAccessSQL.getAllCtrlAccess()", JSON.stringify(ctrlAccessList), 3600);
            }
            if (ok && bCache) {
                ctrlAccessList = JSON.parse(sCache);
            }
            return ctrlAccessList;
        });
    }
    saveCtrlAccess(idCtrlAccess, data) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            this.errorSys.declare([
                'save_ctrl_access'
            ]);
            let vCtrlAccessE = new CtrlAccessE_1.CtrlAccessE();
            if (ok && this.modelValidatorSys.fValid(vCtrlAccessE.getRulesUpdate(), data)) {
                let resp = null;
                try {
                    resp = yield this.db('ctrl_access')
                        .where({
                        id: idCtrlAccess
                    })
                        .update(this.modelValidatorSys.getResult());
                }
                catch (e) {
                    ok = false;
                    this.errorSys.error('save_ctrl_access', 'Не удалось сохранить изменения в группе');
                }
            }
            let aRelatedKeyRedis = [];
            if (ok) {
                aRelatedKeyRedis = yield this.redisSys.keys('CtrlAccessSQL*');
                this.redisSys.del(aRelatedKeyRedis);
            }
            return ok;
        });
    }
    addCtrlAccess(data) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            let resp;
            this.errorSys.declare([
                'add_ctrl_access'
            ]);
            let vCtrlAccessE = new CtrlAccessE_1.CtrlAccessE();
            if (ok && this.modelValidatorSys.fValid(vCtrlAccessE.getRulesInsert(), data)) {
                try {
                    resp = yield this.db('ctrl_access')
                        .returning('id')
                        .insert(this.modelValidatorSys.getResult());
                    if (resp) {
                        resp = resp[0];
                    }
                }
                catch (e) {
                    ok = false;
                    this.errorSys.error('add_ctrl_access', 'Не удалось добавить контроль доступа');
                }
            }
            let aRelatedKeyRedis = [];
            if (ok) {
                aRelatedKeyRedis = yield this.redisSys.keys('CtrlAccessSQL*');
                this.redisSys.del(aRelatedKeyRedis);
            }
            return resp;
        });
    }
    delCtrlAccessByAlias(aliasCtrlAccess) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            this.errorSys.declare([
                'del_ctrl_access'
            ]);
            let resp = null;
            try {
                resp = yield this.db('ctrl_access')
                    .where({
                    alias: aliasCtrlAccess,
                })
                    .limit(1)
                    .del(this.modelValidatorSys.getResult());
            }
            catch (e) {
                ok = false;
                this.errorSys.error('del_ctrl_access', 'Не удалось удалить контроллер доступа');
            }
            let aRelatedKeyRedis = [];
            if (ok) {
                aRelatedKeyRedis = yield this.redisSys.keys('CtrlAccessSQL*');
                this.redisSys.del(aRelatedKeyRedis);
            }
            return ok;
        });
    }
    cntCtrlAccessByAlias(aliasCtrlAccess) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            this.errorSys.declare([
                'cnt_ctrl_access'
            ]);
            let resp = null;
            let cntCtrlAccess = 0;
            if (ok) {
                let sql = `
                SELECT
                    COUNT(*) cnt
                FROM ctrl_access ca
                WHERE ca.alias = :alias
                LIMIT 1
            `;
                try {
                    resp = (yield this.db.raw(sql, {
                        'alias': aliasCtrlAccess
                    }))[0];
                    cntCtrlAccess = Number(resp[0]['cnt']);
                }
                catch (e) {
                    ok = false;
                    this.errorSys.error('cnt_ctrl_access', 'Не удалось подсчитать контроль доступа');
                }
            }
            if (ok) {
                return cntCtrlAccess;
            }
            else {
                return -1;
            }
        });
    }
}
exports.CtrlAccessSQL = CtrlAccessSQL;
//# sourceMappingURL=CtrlAccessSQL.js.map