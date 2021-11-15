/**
* Аутенфикация пользователя
*/
export namespace AuthR {
	/**
	 * Аутенфикация по apikey
	 */
	export namespace authByApikey {
		/** APIURL */
		export const route = '/auth/auth-by-apikey';

		/** Параметры api запроса */
		export interface RequestI {
			apikey: string; // Не раскодированный apikey (из cookie или headers)
		}

		/** Параметры api ответа */
		export interface ResponseI {
			/** основная информация о пользователе */
			user_info: UserInfoI | null;
			/** доступные пользователю группы */
			list_user_group: {
				/** ID группы */
				group_id: number;
				/** Имя группы */
				group_name: string;
				/** Псевдоним группы */
				alias: string;
			}
			/** доступные пользователю контроллеры */
			list_user_ctrl: {
				/** Id контроллера */
				ctrl_id: number;
				/** Псевдоним пользователя */
				ctrl_alias: number;
			}
		}
	}
}

/**
 * Основная информация пользователя
 */
export interface UserInfoI {
	user_id: number;
	user_type: number;
	group_id: number;
	username: string;
	username_clean: string;
	user_email: string;
	user_birthday: string;
	user_avatar: string;
	user_avatar_type: string;
	user_mobile: string;
	user_sig: string;
	consumer_rating: number;
}
