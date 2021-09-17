/**
 * интерфейс таблицы p63_route_of_route_group
 */
export interface RouteOfRouteGroupI {
	id: number;
	route_id: number; // id роута
	route_group_id: number; // id группы роутов
}

/**
 * таблица соотношения групп роутов и самих роутов
 */
export class RouteOfRouteGroupE {
	/** Имя таблицы */
	public static NAME = 'p63_route_of_route_group';
}
