/**
 * интерфейс таблицы p63_user_orgrole
 */
export interface UserOrgroleI {
	id?: number;
	user_id?: number;
	orgrole_id?: number;
	org_id?: number; // id организации в которой у пользователя оргроль
}

/**
 * интерфейс роута, доступного по орг роли пользователя
 */
export interface OrgRouteOfUserI {
	orgrole_id?: number;
	name?: string;
	url?: string;
}

/**
 * таблица ролей пользователей в организациях
 */
export class UserOrgroleE {
	public static NAME = 'p63_user_orgrole';
}
