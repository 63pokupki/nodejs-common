
import { RedisSys } from '../src/System/RedisSys'
import { v4 as uuidv4 } from 'uuid';

export const redisConf = {
	// Конфигруация редиса
	url: 'redis://127.0.0.1:6379',
	// url:'redis://10.1.100.105:6381'
};
const aConnect:any[] = [];
export const redisSys = new RedisSys(redisConf.url);

async function run(){
	for (let i = 0; i < 10000; i++) {
		for (let j = 0; j < 10000; j++) {

			const v = await redisSys.set(uuidv4(), uuidv4());


			process.stdout.write('.');
		}

		await redisSys.clear('*a*', 1000);
	}
}

run();