import { SeoConfigI } from '../Components/Seo';
/**
 * Подключение к S3
 */
export interface S3confI {
    endpoint: string;
    bucket: string;
    baseUrl: string;
    access: string;
    secret: string;
}


export interface MainConfig { // Конфигурация
	// ================================
	mysql: { // Конфиг для MySql
		client: string, // mysql
		connection: { // Параметры соединения
			host: string; // "127.0.0.1"
			user: string; // Пользователь
			password: string; // Пароль
			database: string; // Имя базы данных
		},
		pool: { min: number, max: number }, // Количество соединений
		migrations: {
			tableName: string; // "knex_migrations",
			directory: string; // "./src/Infrastructure/SQL/Migrations"
		},
		acquireConnectionTimeout: number; // таймоут 60000
	};
	// ================================
	mysqlMaster: { // Конфиг для MySql
		client: string, // mysql
		connection: { // Параметры соединения
			host: string; // "127.0.0.1"
			user: string; // Пользователь
			password: string; // Пароль
			database: string; // Имя базы данных
		},
		pool: { min: number, max: number }, // Количество соединений
		migrations: {
			tableName: string; // "knex_migrations",
			directory: string; // "./src/Infrastructure/SQL/Migrations"
		},
		acquireConnectionTimeout: number; // таймоут 60000
	};
	// ================================

	redis: { // Конфиг для редиса
		url: string; // "redis://127.0.0.1:6379"
	};
	// ================================
	common: { // Общее
		env: string; // Тип окружения
		oldCoreURL: string; // URL адрес основного сайта
		errorMute: boolean;
		hook_url_errors: string; // Сообщения об ошибках mattermost
		hook_url_monitoring: string; // Сообщения мониторинга в mattermost
		port: number; // порт на котором будет работать экземпляр ноды
	};

	rabbit: {
		connection: string;
		queryList: string[];
	};

    S3DO?: S3confI, // Хранилище обзих
    S3DO256?: S3confI, // Хранилище картинок товара x256
	S3DO512?: S3confI, // Хранилище картинок товара x512
	S3DOPrivMsg512?: S3confI, // Хранилище картинок приватных сообщений x512

	SeoConfig?: SeoConfigI

}
