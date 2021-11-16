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
			list_group: {
				/** ID группы */
				group_id: number;
				/** Имя группы */
				group_name: string;
				/** Псевдоним группы */
				group_alias: string;
			}[];
			/** доступные пользователю контроллеры */
			list_ctrl: {
				/** Id контроллера */
				ctrl_id: number;
				/** Псевдоним пользователя */
				ctrl_alias: string;
			}[];
		}
	}

	/**
	 * Получить роут, доступные пользователю по ролям на сайте
	 */
	export namespace getListRouteByRole {
		/** APIURL */
		export const route = '/auth/get-list-route-by-role';

		/** Параметры api запроса */
		export interface RequestI {
			user_id: number; // Или поменять на apikey для безопасности
		}

		/** Параметры api ответа */
		export interface ResponseI {
			/** */
			list_route_url: string[];
		}
	}

	/**
	 * Получить роут, доступные пользователю по орг ролям
	 */
	export namespace getListRouteByOrgRole {
		/** APIURL */
		export const route = '/auth/get-list-route-by-orgrole';

		/** Параметры api запроса */
		export interface RequestI {
			user_id: number; // Или поменять на apikey для безопасности
		}

		/** Параметры api ответа */
		export interface ResponseI {
			/** список роутов, доступных по орг ролям */
			list_org_route: {
				/** ID организации */
				org_id: number;
				/** Url роута */
				route_url: string;
			}[];
		}
	}

	/**
	 * Получить контроллеры, доступные пользователю по его группам
	 */
	export namespace getListCtrl {
		/** APIURL */
		export const route = '/auth/get-list-ctrl';

		/** Параметры api запроса */
		export interface RequestI {
			user_id: number; // Или поменять на apikey для безопасности
		}

		/** Параметры api ответа */
		export interface ResponseI {
			/** Псевдонимы контроллеров, доступные пользователю */
			list_ctrl_alias: string[];
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
