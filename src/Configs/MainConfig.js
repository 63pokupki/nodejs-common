import * as pgConf from './pg.json';
import * as myConf from './mysql.json'
import * as redisConf from './redis.json'
import * as general from './general.json'

// Тип окружения
export const envType = general.envType;

// URL старого сайта old_core
export const oldCoreURL = general.oldCoreURL;

//Конфигурация базы данных
module.exports = {
    //Общие настройки
    common:{
        "envType":"dev",
        "oldCoreURL":"http://dev.63pokupki.ru"
    },

    // Старая база данных
    mysql: {
        "client": "mysql",
        "connection": {
            "host": "10.1.100.71",
            "user": "dbadm",
            "password": "Dbadm123!",
            "database": "SPWWW"
        },
        "pool": {"min": 0, "max": 7},
        "migrations": {
            "tableName": "knex_migrations",
            "directory": "./src/Infrastructure/SQL/Migrations"
        },
        "acquireConnectionTimeout": 60000
    },

    /**
     * Новая база данных
     * Конфигурация для sequelizejs. Соединение с Postgresql базой.
     * @see http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
     */
    pgsql:{
        "dialect": "postgres",
        "username": "pg2",
        "password": "123",
        "host": "127.0.0.1",
        "port": 5432,
        "database": "db1",
        "dialectOptions": {
            "supportBigNumbers": true,
            "decimalNumbers": true
        }
    },

    redis:{
        "url":"redis://127.0.0.1:6379"
    }
};

// Конфигруация редиса
export const redisConfig = redisConf;
