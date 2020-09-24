"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSQL = void 0;
const utf8 = __importStar(require("utf8"));
const uniqid_1 = __importDefault(require("uniqid"));
const md5_1 = __importDefault(require("md5"));
const BaseSQL_1 = __importDefault(require("../../../System/BaseSQL"));
/**
 * Здесь методы для SQL запросов
 */
class UserSQL extends BaseSQL_1.default {
    /**
     * Получить список пользователей
     *
     * @param integer iOffset
     * @param integer iLimit
     * @param array sSearchFIO
     * @return array|null
     */
    async getUserList(iOffset, iLimit, aFilter) {
        let resp = null;
        let sql = '';
        let sSearchFIO = '';
        if (aFilter.search_fullname) {
            sSearchFIO = aFilter.search_fullname;
        }
        let sSearchUserName = '';
        if (aFilter.search_username) {
            sSearchUserName = aFilter.search_username;
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
            resp = (await this.db.raw(sql, {
                offset: iOffset,
                limit: iLimit,
                search_username: `%${sSearchUserName}%`,
                search_fullname: `%${sSearchFIO}%`,
            }))[0];
        }
        catch (e) {
            this.errorSys.errorEx(e, 'get_user', 'Не удалось получить пользователя');
        }
        return resp;
    }
    /**
     * Получить пользователя по ID
     *
     * @param integer idUser
     * @return array|null
     */
    async getUserByID(idUser) {
        let resp = null;
        let sql = '';
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
            resp = (await this.db.raw(sql, {
                user_id: idUser,
            }))[0];
            if (resp.length > 0) {
                resp = resp[0];
            }
            else {
                resp = null;
            }
        }
        catch (e) {
            this.errorSys.error('get_user', 'Не удалось получить пользователя');
        }
        return resp;
    }
    /* выдает инфу по юзеру по apikey */
    async fGetUserInfoByApiKey(apikey = '') {
        let ok = true;
        let resp = null;
        if (ok) {
            const sql = `
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
				u.user_sig,
				u.consumer_rating
                from phpbb_users u

                join user_token ut
                on ut.user_id=u.user_id

                where ut.token= :token

                limit 1
            `;
            try {
                resp = (await this.db.raw(sql, {
                    token: apikey,
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
    }
    /**
     * проверка на то что есть apikey в базе
     */
    async isAuth(apikey = '') {
        let bResp = false;
        let sql = '';
        let resp = null;
        /* если ключ больше 4 */
        if (apikey.length > 4) {
            if (await this.redisSys.get(`is_auth_${apikey}`)) {
                bResp = true;
                this.errorSys.devNotice(`cache:UserSQL.isAuth(${apikey})`, 'Взято из кеша');
            }
            else {
                // Получаем одного пользователя
                sql = `
                    select ut.token from user_token ut

                    where ut.token= :token order by ut.user_token_id desc

                    limit 1;
                `;
                try {
                    resp = (await this.db.raw(sql, {
                        token: apikey,
                    }))[0];
                    if (resp.length > 0) {
                        bResp = true;
                        this.redisSys.set(`is_auth_${apikey}`, 1, 3600);
                    }
                }
                catch (e) {
                    this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
                }
            }
        }
        return bResp;
    }
    /* выдает id юзера по телефону и смс из таблицы user_mobile_code */
    async getUserIdByPhoneAndSms(phone, sms) {
        let resp = null;
        let idUser = 0;
        /* дата создания смски сегодня или никогда */
        const sql = `
            select um.user_id from user_mobile_code um

            where
            (um.number= :phone)
            AND(um.code= :sms)
            AND ((um.created + INTERVAL 1 DAY) between NOW() and (NOW() + INTERVAL 1 DAY) )

            limit 1
        `;
        try {
            resp = (await this.db.raw(sql, {
                phone,
                sms,
            }))[0];
            if (resp.length > 0) {
                idUser = resp[0].user_id;
            }
            else {
                resp = null;
            }
        }
        catch (e) {
            this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
        }
        return idUser;
    }
    /* выдает строчку инфы из базы по логину об юзере */
    async getUserByUsername(username) {
        let ok = true;
        let resp = null;
        if (ok) {
            /* todo прикрутить reddis */
            const sql = `
                SELECT *
                FROM phpbb_users
                WHERE username_clean = :username limit 1
                ;
            `;
            try {
                resp = (await this.db.raw(sql, {
                    username: utf8.encode(username),
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
    }
    /* выдает apikey по user_id */
    async getUserApiKey(user_id) {
        let ok = true;
        let resp = null;
        let token = null;
        if (ok) { /* выбираем последний из вставленных */
            const sql = `
                select * from user_token ut
                where ut.user_id = :user_id
                order by ut.user_token_id desc
                limit 1
                ;
            `;
            try {
                resp = (await this.db.raw(sql, {
                    user_id,
                }))[0];
                if (resp.length > 0) {
                    token = resp[0].token;
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
    }
    /* вставляет ключ для юзера */
    /* ничего не проверяет только вставляет */
    async insertUserApiKey(user_id) {
        let ok = true;
        const apikey = this.generateApiKey();
        try {
            await this.db('user_token').insert({
                api_key: apikey,
                user_id: Number(user_id),
            });
        }
        catch (e) {
            ok = false;
            this.errorSys.error('inser_key_for_user', 'Не удалось вставить ключ пользователя');
        }
        if (ok) {
            return apikey;
        }
        return null;
    }
    /* генерирует apikey */
    generateApiKey(max = 20) {
        /* md5 от текущей даты-вермени + рандом */
        return uniqid_1.default(md5_1.default(String(new Date().getTime())));
    }
    /* выдает инфу по юзеру по id */
    async fGetUserInfoById(userId) {
        let resp = null;
        const sql = `
            select u.* from phpbb_users u

            where u.user_id= :user_id

            limit 1
        `;
        try {
            resp = (await this.db.raw(sql, {
                user_id: userId,
            }))[0];
            if (resp.length > 0) {
                resp = resp[0];
            }
            else {
                resp = null;
            }
        }
        catch (e) {
            this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
        }
        return resp;
    }
}
exports.UserSQL = UserSQL;
//# sourceMappingURL=UserSQL.js.map