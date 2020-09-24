// process.env.TS_CONFIG_PATHS = 'true';
import fs from 'fs';
import { getS3objectParamsI } from '../lib/System/S3DO';
import { S3DO, S3objectParamsI, setS3objectAclParamsI } from '../src/System/S3DO';
import { S3confDO } from './S3DO.sample';

const assert = require('chai').assert;

/**
 * обертка для чтения файла
 * @param file - путь к файлу
 */
function readFile(file: string): Promise<unknown> {
	return new Promise((resolve, reject) => {
		fs.readFile(file, (err: any, data: any) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
}

/**
 * API для обновления каталогов
 */
describe('Проверка работы s3', () => {
	it('upload', async () => {
		const s3 = new S3DO(S3confDO);
		const data: any = await readFile(`${__dirname}/S3.test.ts`);
		console.log('Upload file ', `${__dirname}/S3.test.ts`);
		const object: S3objectParamsI = {
			Bucket: S3confDO.bucket,
			Key: 'media/S3r3.test.ts',
			ContentType: 'text/html',
			ContentLength: data.length,
			Body: data,
			ACL: 'public-read',
		};
		console.log('object =>>', object);
		const resp = await s3.upload(object);
		console.log('response =>>', resp);
		assert.ok(true);
	}).timeout(10000);

	it('get', async () => {
		const s3 = new S3DO(S3confDO);
		const object: getS3objectParamsI = {
			Bucket: S3confDO.bucket,
			Key: 'media/S3r3.test.ts',
		};
		console.log('object =>>', object);
		const resp = await s3.getObject(object);
		console.log('response =>>', resp);
		assert.ok(true);
	}).timeout(10000);

	it('put acl', async () => {
		const s3 = new S3DO(S3confDO);
		const object: setS3objectAclParamsI = {
			Bucket: S3confDO.bucket,
			Key: 'media/S3r3.test.ts',
			ACL: 'public-read',
		};
		console.log('object =>>', object);
		const resp = await s3.setObjectAcl(object);
		console.log('response =>>', resp);
		assert.ok(true);
	}).timeout(10000);
});
