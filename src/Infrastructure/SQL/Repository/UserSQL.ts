import * as utf8 from 'utf8';
import uniqid from 'uniqid';
import md5 from 'md5';

import { UserE, UserI } from '../Entity/UserE';
import BaseSQL from '../../../System/BaseSQL';
import { UserInfoI } from '../../../System/UserSys';

/**
 * Здесь методы для SQL запросов
 */
export class UserSQL extends BaseSQL {
	/**
	 * Получить список пользователей
	 * @param iOffset
	 * @param iLimit
	 * @param aFilter
	 */
	public async getUserList(iOffset: number, iLimit: number, aFilter: { [key: string]: any }): Promise<any> {
		let resp = null;

		let sSearchFIO = '';
		if (aFilter.search_fullname) {
			sSearchFIO = aFilter.search_fullname;
		}

		let sSearchUserName = '';
		if (aFilter.search_username) {
			sSearchUserName = aFilter.search_username;
		}

		const sql = `
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
            FROM ${UserE.NAME} u
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
		} catch (e) {
			this.errorSys.errorEx(e, 'get_user', 'Не удалось получить пользователя');
		}

		return resp;
	}

	/**
	 * Получить пользователя по ID
	 * @param idUser
	 */
	public async getUserByID(idUser: number): Promise<any> {
		let resp = null;

		const sql = `
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
            FROM ${UserE.NAME} u
            WHERE u.user_id = :user_id
			LIMIT 1
			;
        `;

		try {
			resp = (await this.db.raw(sql, { user_id: idUser }))[0];

			if (resp.length > 0) {
				resp = resp[0];
			} else {
				resp = null;
			}
		} catch (e) {
			this.errorSys.error('get_user', 'Не удалось получить пользователя');
		}

		return resp;
	}

	/**
	 * Получить информацию о пользователе по apikey
	 * @param apikey
	 */
	public async fGetUserInfoByApiKey(apikey = ''): Promise<UserInfoI> {
		let resp = null;

		const sql = `
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
				u.consumer_rating
            FROM ${UserE.NAME} u
            JOIN user_token ut ON ut.user_id = u.user_id
            WHERE ut.token = :token
            LIMIT 1
        `;

		try {
			resp = (await this.db.raw(sql, { token: apikey }))[0];

			if (resp.length > 0) {
				resp = resp[0];
			} else {
				resp = null;
			}
		} catch (e) {
			this.errorSys.error('user_info_by_apikey', 'Не удалось получить информацию о пользователе');
		}

		return resp;
	}

	/**
	 * Проверка, есть ли apikey в базе
	 * @param apikey
	 */
	public async isAuth(apikey = ''): Promise<boolean> {
		let bResp = false;
		let resp: any[] = null;

		/* если ключ больше 4 */
		if (apikey.length > 4) {
			if (await this.redisSys.get(`is_auth_${apikey}`)) {
				bResp = true;
				this.errorSys.devNotice(`cache:UserSQL.isAuth(${apikey})`, 'Взято из кеша');
			} else {
				// Получаем одного пользователя
				const sql = `
					SELECT 
						ut.token 
					FROM user_token ut
                    WHERE ut.token = :token order by ut.user_token_id desc
					LIMIT 1
					;
                `;

				try {
					resp = (await this.db.raw(sql, { token: apikey }))[0];

					if (resp.length > 0) {
						bResp = true;
						this.redisSys.set(`is_auth_${apikey}`, 1, 3600);
					}
				} catch (e) {
					this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
				}
			}
		}

		return bResp;
	}

	/**
	 * Выдает id юзера по телефону и смс из таблицы user_mobile_code
	 * @param phone
	 * @param sms
	 */
	public async getUserIdByPhoneAndSms(phone: string, sms: string): Promise<number> {
		let resp: any[] = null;
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
			resp = (await this.db.raw(sql, { phone, sms }))[0];

			if (resp.length > 0) {
				idUser = resp[0].user_id;
			} else {
				resp = null;
			}
		} catch (e) {
			this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
		}

		return idUser;
	}

	/**
	 * выдает строчку инфы из базы по логину об юзере
	 * @param username
	 */
	public async getUserByUsername(username: string): Promise<any[]> {
		let resp: any[] = null;

		/* todo прикрутить reddis */
		const sql = `
			SELECT *
			FROM phpbb_users
			WHERE username_clean = :username limit 1
			;
		`;

		try {
			resp = (await this.db.raw(sql, { username: utf8.encode(username) }))[0];

			if (resp.length > 0) {
				resp = resp[0];
			} else {
				resp = null;
			}
		} catch (e) {
			this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
		}

		return resp;
	}

	/**
	 * выдает apikey по user_id
	 * @param user_id
	 */
	public async getUserApiKey(user_id: number): Promise<string> {
		let resp: any[] = null;

		let token: string = null;
		const sql = `
            select * from user_token ut
            where ut.user_id = :user_id
            order by ut.user_token_id desc
            limit 1
            ;
        `;

		try {
			resp = (await this.db.raw(sql, { user_id }))[0];

			if (resp.length > 0) {
				token = resp[0].token;
			} else {
				token = null;
			}
		} catch (e) {
			this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
		}

		return token;
	}

	/**
	 * вставляет ключ для юзера
	 * ничего не проверяет только вставляет
	 * @param user_id
	 */
	public async insertUserApiKey(user_id: number): Promise<string> {
		const apikey = this.generateApiKey();

		try {
			await this.db('user_token').insert({ api_key: apikey, user_id: Number(user_id) });
		} catch (e) {
			this.errorSys.error('inser_key_for_user', 'Не удалось вставить ключ пользователя');
		}

		return apikey;
	}

	/* генерирует apikey */
	public generateApiKey(max = 20): string {
		/* md5 от текущей даты-вермени + рандом */
		return uniqid(md5(String(new Date().getTime())));
	}

	/**
	 * выдает инфу по юзеру по id
	 * @param userId
	 */
	public async fGetUserInfoById(userId: number): Promise<any[]> {
		let resp: any[] = null;

		const sql = `
            select u.* from ${UserE.NAME} u
            where u.user_id= :user_id
            limit 1
        `;

		try {
			resp = (await this.db.raw(sql, { user_id: userId }))[0];

			if (resp.length > 0) {
				resp = resp[0];
			} else {
				resp = null;
			}
		} catch (e) {
			this.errorSys.error('api_key_in_db', 'Не удалось проверить apikey');
		}

		return resp;
	}
}
