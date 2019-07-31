"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const utf8 = require('utf8');
const uniqid = require('uniqid');
var md5 = require('md5');
const BaseSQL_1 = require('../../../System/BaseSQL');
class UserSQL extends BaseSQL_1.default {
    constructor(req) {
        super(req);
    }
    getUserList(iOffset, iLimit, aFilter) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            let resp = null;
            let sql = '';
            this.errorSys.declare([
                'get_user'
            ]);
            let sSearchFIO = "";
            if (aFilter['search_fullname']) {
                sSearchFIO = aFilter['search_fullname'];
            }
            let sSearchUserName = "";
            if (aFilter['search_username']) {
                sSearchUserName = aFilter['search_username'];
            }
            sql = `
            SELECT
                u.user_id,
                u.user_type,
                u.group_id,
                u.username,
                u.username_clean,
                u.user_email,
                u.user_birthday,
                u.user_avatar,
                u.user_avatar_type,
                u.user_mobile,
                u.user_sig,
                u.user_fullname
            FROM phpbb_users u
            WHERE
                u.username LIKE :search_username
            AND
                u.user_fullname LIKE :search_fullname
            LIMIT :limit
            OFFSET :offset
            ;
        `;
            try {
                resp = (yield this.db.raw(sql, {
                    'offset': iOffset,
                    'limit': iLimit,
                    'search_username': '%' + sSearchUserName + '%',
                    'search_fullname': '%' + sSearchFIO + '%'
                }))[0];
            }
            catch (e) {
                ok = false;
                this.errorSys.errorEx(e, 'get_user', 'Не удалось получить пользователя');
            }
            return resp;
        });
    }
    getUserByID(idUser) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = this.errorSys.isOk();
            let resp = null;
            let sql = '';
            this.errorSys.declare([
                'get_user'
            ]);
            sql = `
            SELECT
                u.user_id,
                u.user_type,
                u.group_id,
                u.username,
                u.username_clean,
                u.user_email,
                u.user_birthday,
                u.user_avatar,
                u.user_avatar_type,
                u.user_mobile,
                u.user_sig,
                u.user_fullname
            FROM phpbb_users u
            WHERE u.user_id = :user_id
            LIMIT 1
        `;
            try {
                resp = (yield this.db.raw(sql, {
                    'user_id': idUser
                }))[0];
                if (resp.length > 0) {
                    resp = resp[0];
                }
                else {
                    resp = null;
                }
            }
            catch (e) {
                ok = false;
                this.errorSys.error('get_user', 'Не удалось получить пользователя');
            }
            return resp;
        });
    }
    fGetUserInfoByApiKey(apikey = '') {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = true;
            let resp = null;
            this.errorSys.declare([
                'user_info_by_apikey'
            ]);
            if (ok) {
                let sql = `
                SELECT  u.user_id,
                u.user_type,
                u.group_id,
                u.username,
                u.username_clean,
                u.user_email,
                u.user_birthday,
                u.user_avatar,
                u.user_avatar_type,
                u.user_mobile,
                u.user_sig
                from phpbb_users u

                join user_token ut
                on ut.user_id=u.user_id

                where ut.token= :token

                limit 1
            `;
                try {
                    resp = (yield this.db.raw(sql, {
                        'token': apikey
                    }))[0];
                    if (resp.length > 0) {
                        resp = resp[0];
                    }
                    else {
                        resp = null;
                    }
                }
                catch (e) {
                    ok = false;
                    this.errorSys.error('user_info_by_apikey', 'Не удалось получить информацию о пользователе');
                }
            }
            return resp;
        });
    }
    isAuth(apikey = '') {
        return __awaiter(this, void 0, Promise, function* () {
            let bResp = false;
            let sql = '';
            let ok = true;
            let resp = null;
            this.errorSys.declare([
                'api_key_in_db'
            ]);
            if (apikey.length > 4) {
                if (yield this.redisSys.get('is_auth_' + apikey)) {
                    bResp = true;
                    this.errorSys.devNotice(`cache:UserSQL.isAuth(${apikey})`, 'Взято из кеша');
                }
                else {
                    sql = `
                    select ut.token from user_token ut

                    where ut.token= :token order by ut.user_token_id desc

                    limit 1;
                `;
                    try {
                        resp = (yield this.db.raw(sql, {
                            'token': apikey
                        }))[0];
                        if (resp.length > 0) {
                            bResp = true;
                            this.redisSys.set('is_auth_' + apikey, 1, 3600);
                        }
                    }
                    catch (e) {
                        ok = false;
                        this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
                    }
                }
            }
            return bResp;
        });
    }
    getUserIdByPhoneAndSms(phone, sms) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = true;
            let resp = null;
            let idUser = 0;
            this.errorSys.declare([
                'api_key_in_db'
            ]);
            let sql = `
            select um.user_id from user_mobile_code um

            where
            (um.number= :phone)
            AND(um.code= :sms)
            AND ((um.created + INTERVAL 1 DAY) between NOW() and (NOW() + INTERVAL 1 DAY) )

            limit 1
        `;
            try {
                resp = (yield this.db.raw(sql, {
                    'phone': phone,
                    'sms': sms
                }))[0];
                if (resp.length > 0) {
                    idUser = resp[0]['user_id'];
                }
                else {
                    resp = null;
                }
            }
            catch (e) {
                ok = false;
                this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
            }
            return idUser;
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let ok = true;
            let resp = null;
            this.errorSys.declare([
                'api_key_in_db'
            ]);
            if (ok) {
                let sql = `
                SELECT *
                FROM phpbb_users
                WHERE username_clean = :username limit 1
                ;
            `;
                try {
                    resp = (yield this.db.raw(sql, {
                        'username': utf8.encode(username),
                    }))[0];
                    if (resp.length > 0) {
                        resp = resp[0];
                    }
                    else {
                        resp = null;
                    }
                }
                catch (e) {
                    ok = false;
                    this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
                }
            }
            return resp;
        });
    }
    getUserApiKey(user_id) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = true;
            let resp = null;
            this.errorSys.declare([
                'api_key_in_db'
            ]);
            let token = null;
            if (ok) {
                let sql = `
                select * from user_token ut
                where ut.user_id = :user_id
                order by ut.user_token_id desc
                limit 1
                ;
            `;
                try {
                    resp = (yield this.db.raw(sql, {
                        'user_id': user_id,
                    }))[0];
                    if (resp.length > 0) {
                        token = resp[0]['token'];
                    }
                    else {
                        token = null;
                    }
                }
                catch (e) {
                    ok = false;
                    this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
                }
            }
            return token;
        });
    }
    insertUserApiKey(user_id) {
        return __awaiter(this, void 0, Promise, function* () {
            let ok = true;
            let sql = '';
            let apikey = this.generateApiKey();
            this.errorSys.declare([
                'inser_key_for_user'
            ]);
            user_id = Number(user_id);
            sql = `INSERT INTO user_token (\`user_id\`, \`token\`) VALUES (:user_id, :api_key)`;
            let resp = null;
            try {
                resp = yield this.db('user_token').insert({
                    api_key: apikey,
                    user_id: user_id,
                });
            }
            catch (e) {
                ok = false;
                this.errorSys.error('inser_key_for_user', 'Не удалось вставить ключ пользователя');
            }
            if (ok) {
                return apikey;
            }
            else {
                return null;
            }
        });
    }
    generateApiKey(max = 20) {
        return uniqid(md5(new Date().getTime()));
    }
    fGetUserInfoById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ok = true;
            let resp = null;
            this.errorSys.declare([
                'api_key_in_db'
            ]);
            let sql = `
            select u.* from phpbb_users u

            where u.user_id= :user_id

            limit 1
        `;
            try {
                resp = (yield this.db.raw(sql, {
                    'user_id': userId,
                }))[0];
                if (resp.length > 0) {
                    resp = resp[0];
                }
                else {
                    resp = null;
                }
            }
            catch (e) {
                ok = false;
                this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
            }
            return resp;
        });
    }
}
exports.UserSQL = UserSQL;
//# sourceMappingURL=UserSQL.js.map