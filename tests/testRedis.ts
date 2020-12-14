
import { RedisSys } from '../src/System/RedisSys'
import { v4 as uuid4 } from 'uuid';


export const redisConf = {

	// Конфигруация редиса

	urlDbMaster: 'redis://127.0.0.1:6379/0',
	urlDbScan: 'redis://127.0.0.1:6379/1',

	// Конфигурация сфинкс
	sphinxIndex:'redis_core_key',
	sphinxDb: {
		// Knex mysql Мастер БД
		client: 'mysql2',
		connection: {
			host: '127.0.0.1',
			port: '3306',
			user: 'root',
			password: '2',
			database: 'redis_key',
			decimalNumbers: true,
			dateStrings: true,
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
		const sKey = `key-${uuid4()}-56d2941-80f7-4f73-bdb9-cc1d0e316a3b-8373663c-3e40-4ae7-8571-7c09d787ade8-3e17d7df-d301-4a05-be27-3bc7406f5725-a196b720-35e6-4d34-b06c-7ff9c3d8b206-2eae7c68-4493-4a33-813e-bf5ebaec49ff-9213e626-c2b8-4108-a9f7-e77cbf7f5827-9426814c-516a-461f-bffb-73e1262347a8`;
			await redisSys.set(sKey, `val-${uuid4()}`, 3600);
		for (let j = 0; j < 100; j++) {


			const v = await redisSys.get(sKey);
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
			a = await redisSys.scan('key-'+uuid4().slice(0,4)+'*')

			cntScan++;
		}
		console.log(`|runScan|${cntScan}|`, a.length);
	}
}

async function runDel(){
	for (let i = 0; i < 10000; i++) {
		let a = [];
		for (let j = 0; j < 100; j++) {
			a = await redisSys.clear('*'+uuid4().slice(0,5)+'*')

			cntScan++;
		}
		console.log(`|runDel|${cntScan}|`, a.length);
	}
}

// Запуск insert
async function runInsert(){
    for (let i = 0; i < 10000; i++) {
		for (let j = 0; j < 10; j++) {
			await redisSys.set(`key-${uuid4()}-${uuid4()}-${uuid4()}-${uuid4()}-${uuid4()}-${uuid4()}-${uuid4()}`, `val-${uuid4()}`, 3600);
			cntInsert++;
		}
		console.log(`|cntInsert|${cntInsert}|`);
	}

    cntInsert++;
    console.log('END');
}

for (let i = 0; i < 100; i++) {
	// runInsert();
}


// for (let i = 0; i < 50; i++) {
	runSelect();
// }

// for (let i = 0; i < 10; i++) {
	runScan();
// }

// for (let i = 0; i < 10; i++) {
	// runDel();
// }
