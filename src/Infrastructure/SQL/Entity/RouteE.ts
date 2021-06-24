/**
 * интерфейс таблицы p63_route
 */
interface RouteI {
	id?: number;
	url?: string;
	name?: string;
	descript?: string;
	created_at?: string;
	updated_at?: string;

}

/**
 * таблица роутов
 */
export class RouteE {
	/** имя таблицы */
	public static NAME = 'p63_route';
}
