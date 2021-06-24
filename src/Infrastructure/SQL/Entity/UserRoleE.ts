/**
 * интерфейс таблицы p63_user_role
 */
export interface UserRoleI {
	id?: number;
	user_id?: number;
	role_id?: number;
}

/**
 * интерфейс роута, доступного по роли пользователя
 */
export interface RouteOfUserI {
	name?: string;
	url?: string;
}

/**
 * таблица ролей пользователей
 */
export class UserRoleE {
	public static NAME = 'p63_user_role';
}