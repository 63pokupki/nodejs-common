import Knex from 'knex';
import { SeoConfigI } from '../Components/Seo';

/** Подключение к S3 */
export interface S3confI {
	endpoint: string;
	bucket: string;
	baseUrl: string;
	access: string;
	secret: string;
}

/** Конфигурация */
export interface MainConfig {
	// Настройки для MySql
	mysql: {
		client: string; 					// mysql
		connection: { 						// Параметры соединения
			host: string; 					// "127.0.0.1"
			user: string; 					// Пользователь
			password: string; 				// Пароль
			database: string; 				// Имя базы данных
		};
		pool: { min: number; max: number }; // Количество соединений
		migrations: {
			tableName: string; 				// "knex_migrations",
			directory: string; 				// "./src/Infrastructure/SQL/Migrations"
		};
		acquireConnectionTimeout: number; // таймоут 60000
	};
	// Настройки для MySql
	mysqlMaster: {
		client: string; 					// mysql
		connection: { 						// Параметры соединения
			host: string; 					// "127.0.0.1"
			user: string; 					// Пользователь
			password: string; 				// Пароль
			database: string; 				// Имя базы данных
		};
		pool: { min: number; max: number }; // Количество соединений
		migrations: {
			tableName: string; 				// "knex_migrations",
			directory: string; 				// "./src/Infrastructure/SQL/Migrations"
		};
		acquireConnectionTimeout: number; 	// таймоут 60000
	};
	// Настройки редиса
	redis: {

		// Конфигруация редиса
		urlDbMaster: string;
		urlDbScan: string;

		// Конфигурация сфинкс
		sphinxIndex?: string; // индекс sphinx для поиска ключей
		sphinxDb?: any; // Knex Конфигурайия для подключения к sphinx
	};
	// Общие настройки
	common: {
		env: string; 					// Тип окружения
		nameApp?: string; 				// Имя приложения выводится если стукнуться GET
		oldCoreURL: string; 			// URL адрес основного сайта
		errorMute: boolean;
		hook_url_errors?: string; 		// Сообщения об ошибках mattermost
		hook_url_monitoring?: string; 	// Сообщения мониторинга в mattermost
		hook_url_front_errors?: string; // Сообещения об ошибках с фронта в mattermost
		port: number; 					// порт на котором будет работать экземпляр ноды
		hook_url_errors_api: string;	// url для миграции ошибок в сфинкс
	};

	rabbit: {
		connection: string;
		queryList: string[];
	};

	S3DO?: S3confI; 			// Хранилище обзих
	S3DO256?: S3confI; 			// Хранилище картинок товара x256
	S3DO512?: S3confI; 			// Хранилище картинок товара x512
	S3DO1024?: S3confI; 		// Хранилище картинок товаров x1024
	S3DOPrivMsg512?: S3confI; 	// Хранилище картинок приватных сообщений x512

	SeoConfig?: SeoConfigI;
}
