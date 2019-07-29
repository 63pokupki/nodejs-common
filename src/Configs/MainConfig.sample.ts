import * as pgConf from './pg.json';
import * as myConf from './mysql.json'

// Тип окружения
export const envType = 'dev';

//Конфигурация базы данных
export const coreDBConfig = {
    old: myConf,
    /**
     * Конфигурация для sequelizejs
     * @see http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
     */
    new: pgConf,
};

// Конфигруация редиса
export const redisConfig = {
    url:'redis://127.0.0.1:6379',
};
