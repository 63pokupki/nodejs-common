/**
 * интерфейс таблицы p63_orgrole_of_route_group
 */
export interface OrgroleOfRouteGroupI {
	id: number;
	orgrole_id: number;
	route_group_id: number;
	created_at: string;
	updated_at: string;
}

/**
 * таблица соотношения ролей в организации и доступных групп роутов
 */
export class OrgroleOfRouteGroupE {
	public static NAME = 'p63_orgrole_of_route_group';
}
