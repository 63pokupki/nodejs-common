// Конфигурация
module.exports = {
	mysql: { // Knex mysql
		client: 'mysql',
		connection: {
			host: '10.1.100.211',
			user: 'dbadm',
			password: 'Dbadm123!',
			database: 'spwww',
		},
		pool: { min: 0, max: 7 },
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/Infrastructure/SQL/Migrations',
		},
		acquireConnectionTimeout: 60000,
	},

	// mysql: { // Локальная база Knex mysql
	// 	client: 'mysql',
	// 	connection: {
	// 		host: '127.0.0.1',
	// 		user: 'spwww',
	// 		password: 'KJNhuk8juN7kf92H',
	// 		database: 'spwww',
	// 	},
	// 	pool: { min: 0, max: 7 },
	// 	migrations: {
	// 		tableName: 'knex_migrations',
	// 		directory: './src/Infrastructure/SQL/Migrations',
	// 	},
	// 	acquireConnectionTimeout: 60000,
	// },

	common: { // Общие настройки
		env: 'local', // Тип окружения
		oldCoreURL: 'http://dev.63pokupki.ru', // URL старого сайта old_core
		port: 3005,
	},

	/**
     * Конфигурация для sequelizejs. Соединение с Postgresql базой.
     * @see http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
     */
	// pgsql: {
	// 	dialect: 'postgres',
	// 	username: 'sp',
	// 	password: 'xa8Ooxay',
	// 	host: '10.1.100.106',
	// 	port: 5432,
	// 	database: 'sp',
	// 	dialectOptions: {
	// 		supportBigNumbers: true,
	// 		decimalNumbers: true,
	// 	},
	// },

	// Конфигурация для sequelizejs. Соединение со старой MariaDB базой.
	mysql2: {
		dialect: 'mysql',
		host: '10.1.100.211',
		username: 'dbadm',
		password: 'Dbadm123!',
		database: 'spwww',
		port: 3306,
		dialectOptions: {
			supportBigNumbers: true,
			decimalNumbers: true,
		},
	},

	// mysql2: { // локальная база
	// 	dialect: 'mysql',
	// 	host: '127.0.0.1',
	// 	username: 'spwww',
	// 	password: 'KJNhuk8juN7kf92H',
	// 	database: 'spwww',
	// 	port: 3306,
	// 	dialectOptions: {
	// 		supportBigNumbers: true,
	// 		decimalNumbers: true,
	// 	},
	// },

	redis: { // Конфигруация редиса
		url: 'redis://127.0.0.1:6379',
	},

	/*

    Конфиг одклчения RabbitMQ
    Для для запуска на локальной машине
    docker run -d --hostname 0.0.0.0 --network host rabbitmq:3

    Документация
    https://docs.docker.com/samples/library/rabbitmq/
    https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

*/
	rabbit: {
		// Список очередей которые будут подняты
		queryList: [
			'item_img', // Очередь для картинок каталога
		],
		// Соединение с кроликом
		connection: 'amqp://devs3.63pokupki.ru:5672',
	},

	S3: {
		endpoint: 'http://devs3.63pokupki.ru:8000',
		bucket: {
			item: 'item', // Картинки для товаров
		},
		baseUrl: 'https://dev.picture.63pokupki.ru',
		access: 'accessKey1',
		secret: 'verySecretKey1',
	},
};
