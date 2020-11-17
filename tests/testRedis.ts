import { RedisSys } from '../src/System/RedisSys'


export const redisConf = {
	// Конфигруация редиса
	url: 'redis://127.0.0.1:6379',
};
export const redisSys = new RedisSys(redisConf);

async function run(){
	const v = await redisSys.scan('*', 1000);
	await redisSys.del(v);
}

run();