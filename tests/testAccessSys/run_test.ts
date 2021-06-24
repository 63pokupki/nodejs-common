import { AccessSys } from '../../src/System/AccessSys';
import * as self from './Header';

const run = async () => {
	console.log('===========================');
	console.log('======  Начало теста  =====');
	console.log('===========================');
	console.log('');
	console.log(`User ID: ${self.idUser}`);
	console.log(`Имя контроллера: ${self.ctrlName}`);
	console.log(`Роут: ${self.route}`);
	console.log(`ID организации: ${self.org_id}`);
	
	const accessSys = new AccessSys(await self.mainRequest);



	console.log('');
	console.log('=======================================');
	console.log('== Проверка доступа по роли на сайте ==');
	// console.log('=======================================');
	console.log('');

	try{
		await accessSys.accessAction();
		console.log('Доступ по роли разрешен');
	} catch (e) {
		console.log('Доступ по роли запрещен');
	}

	console.log('');
	console.log('=======================================');
	console.log('==== Проверка доступа по орг роли =====');
	// console.log('=======================================');
	console.log('');

	try{
		await accessSys.accessActionOrg(self.org_id);
		console.log('Доступ по орг роли разрешен');
	} catch (e) {
		console.log('Доступ по орг роли запрещен');
	}


	console.log('');
	console.log('==============================================');
	console.log('== Проверка доступа к контроллеру по группе ==');
	// console.log('==============================================');
	console.log('');

	try{
		await accessSys.accessCtrl(self.ctrlName);
		console.log('Доступ к контроллеру по группе разрешен');
	} catch (e) {
		console.log('Доступ к контроллеру по группе запрещен');
	}
	console.log('');
	console.log('===========================');
	console.log('======  Тест окончен  =====');
	console.log('===========================');
	console.log('');
	process.exit(1);

}
run().catch((e)=>{
	console.log(e)
	process.exit(0);
});