/**
 * интерфейс роута, доступного по орг роли пользователя
 */
export interface OrgRouteOfUserI {
	orgrole_id?: number;
	name?: string;
	url?: string;
}

/**
 * интерфейс роута, доступного по роли пользователя
 */
export interface RouteOfUserI {
	name?: string;
	url?: string;
}
/**
 * таблица групп пользователей
 */
export namespace PhpbbUserGroupE {
	export const NAME = 'phpbb_user_group';
}

/**
 * таблица роутов
 */
export namespace RouteE {
	/** имя таблицы */
	export const NAME = 'p63_route';
}

/**
 * таблица связей роутов и  групп роутов
 */
export namespace RouteOfRouteGroupE {
	/** Имя таблицы */
	export const NAME = 'p63_route_of_route_group';
}

/**
 * таблица связей ролей и пользователей
 */
export namespace UserRoleE {
	export const NAME = 'p63_user_role';
}

/**
 * таблица связей орг ролей и пользователей
 */
export namespace UserOrgroleE {
	export const NAME = 'p63_user_orgrole';
}

/**
 * таблица связей ролей и групп роутов
 */
export namespace RoleOfRouteGroupE {
	export const NAME = 'p63_role_of_route_group';
}

/**
 * таблица связей орг ролей и  групп роутов
 */
export namespace OrgroleOfRouteGroupE {
	export const NAME = 'p63_orgrole_of_route_group';
}
