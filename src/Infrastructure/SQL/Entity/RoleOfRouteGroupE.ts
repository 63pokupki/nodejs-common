/**
 * интерфейс таблицы p63_role_of_route_group
 */
export interface RoleOfRouteGroupI {
	id: number;
	role_id: number;
	route_group_id: number;
}

/**
 * таблица соотношения ролей и доступных групп роутов
 */
export class RoleOfRouteGroupE {
	public static NAME = 'p63_role_of_route_group';
}
