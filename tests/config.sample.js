// Конфигурация
module.exports = {
	mysql: {
		// Knex mysql
		client: 'mysql',
		connection: {
			host: '',
			user: '',
			password: '',
			database: '',
		},
		pool: { min: 0, max: 7 },
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/Infrastructure/SQL/Migrations',
		},
		acquireConnectionTimeout: 60000,
	},

	common: {
		// Общие настройки
		env: 'local', // Тип окружения
		oldCoreURL: 'http://localhost', // URL старого сайта old_core
		port: 3005,
	},

	/**
	 * Конфигурация для sequelizejs. Соединение с Postgresql базой.
	 * @see http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
	 */
	mysql2: {
		dialect: 'mysql',
		host: '',
		username: '',
		password: '',
		database: '',
		port: 3306,
		dialectOptions: {
			supportBigNumbers: true,
			decimalNumbers: true,
		},
	},

	redis: {
		// Конфигруация редиса
		url: 'redis://127.0.0.1:6379',
	},

	/*
    Конфиг подключения RabbitMQ
    Для для запуска на локальной машине
    docker run -d --hostname 0.0.0.0 --network host rabbitmq:3
    Документация
    https://docs.docker.com/samples/library/rabbitmq/
    https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
	*/
	rabbit: {
		// Список очередей которые будут подняты
		queryList: ['queue1'],
		// Соединение с кроликом
		connection: 'amqp://localhost:5672',
	},

	S3: {
		endpoint: 'http://localhost:8000',
		bucket: {
			item: 'item', // Картинки для товаров
		},
		baseUrl: 'https://localhost',
		access: 'accessKey1',
		secret: 'verySecretKey1',
	},
};
