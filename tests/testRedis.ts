
import { RedisSys } from '../src/System/RedisSys'
import { v4 as uuid4 } from 'uuid';


export const redisConf = {

	// Конфигруация редиса
	urlDbMaster: 'redis://127.0.0.1:6379/0',
	urlDbScan: 'redis://127.0.0.1:6380/1',

	// url:'redis://10.1.100.105:6381'
	// url: 'redis://10.1.100.151:6379',

	// Конфигурация сфинкс
	sphinxIndex:'redis_core_key',
	sphinxDb: {
		// Knex mysql Мастер БД
		client: 'mysql2',
		connection: {
			host: '127.0.0.1',
			port: '9306',
			decimalNumbers: true,
			dateStrings: 'date',
		},
		pool: { min: 0, max: 500 },
		acquireConnectionTimeout: 60000,
	}
};

const aConnect:any[] = [];
export const redisSys = new RedisSys(<any>redisConf);
let cntInsert = 0;
let cntSelect = 0;
let cntScan = 0;
let cntFind = 0;

async function runSelect(){

	for (let i = 0; i < 10000; i++) {
		for (let j = 0; j < 100; j++) {
			const v = await redisSys.get(uuid4().slice(0,3));
			if(v){
				cntFind++;
			}
			cntSelect++;
		}
		console.log(`|runSelect|${cntSelect}|${cntFind}|`);
	}
}

async function runScan(){
	for (let i = 0; i < 10000; i++) {
		let a = [];
		for (let j = 0; j < 100; j++) {
			a = await redisSys.scan('*'+uuid4().slice(0,3)+'*')
			cntScan++;
		}
		console.log(`|runScan|${cntScan}|`, a.length);
	}
}

// Запуск insert
async function runInsert(){
    for (let i = 0; i < 10000; i++) {
		for (let j = 0; j < 100; j++) {
			await redisSys.set(`key-${uuid4()}`, `val-${uuid4()}`, 3600);
			cntInsert++;
		}
		console.log(`|cntInsert|${cntInsert}|`);
	}

    cntInsert++;
    console.log('END');
}

// for (let i = 0; i < 10; i++) {
	runInsert();
// }


// for (let i = 0; i < 10; i++) {
	runSelect();
// }

// for (let i = 0; i < 10; i++) {
	runScan();
// }