// process.env.TS_CONFIG_PATHS = 'true';
import { getS3objectParamsI } from "../lib/System/S3DO";
import { S3DO, S3objectParamsI, setS3objectAclParamsI } from "../src/System/S3DO";
import { S3confDO } from "./S3DO";

const fs = require('fs');

const assert = require('chai').assert;

/**
 * обертка для чтения файла
 * @param file - путь к файлу
 */
function readFile(file: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, function (err: any, data: any) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    })
}

/**
 * API для обновления каталогов
 */
const run = async () => {
    await describe('Проверка работы s3', async () => {
        it('upload', async () => {
            let s3 = new S3DO(S3confDO);
            let data: any = await readFile(__dirname + '/S3.test.ts');
            console.log('Upload file ', __dirname + '/S3.test.ts');
            let object: S3objectParamsI = {
                Bucket: S3confDO.bucket,
                Key: 'media/S3r3.test.ts',
                ContentType: 'text/html',
                ContentLength: data.length,
                Body: data,
                ACL: 'public-read'
            };
            console.log('object =>>', object);
            let resp = await s3.upload(object);
            console.log('response =>>', resp);
            assert.ok(true);
        }).timeout(10000);

        it('get', async () => {
            let s3 = new S3DO(S3confDO);
            let object: getS3objectParamsI = {
                Bucket: S3confDO.bucket,
                Key: 'media/S3r3.test.ts',
            };
            console.log('object =>>', object);
            let resp = await s3.getObject(object);
            console.log('response =>>', resp);
            assert.ok(true);
        }).timeout(10000);

        it('put acl', async () => {
            let s3 = new S3DO(S3confDO);
            let object: setS3objectAclParamsI = {
                Bucket: S3confDO.bucket,
                Key: 'media/S3r3.test.ts',
                ACL: 'public-read'
            };
            console.log('object =>>', object);
            let resp = await s3.setObjectAcl(object);
            console.log('response =>>', resp);
            assert.ok(true);
        }).timeout(10000);
    });
};
run();
