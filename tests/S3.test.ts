// process.env.TS_CONFIG_PATHS = 'true';
const mocha = require('ts-mocha');
var fs = require('fs');

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;

import { S3, S3confI, S3objectParamsI } from "../src/System/S3";


function getRandomInt(min: any, max: any) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const S3conf: S3confI = {
    endpoint: 'test',
    bucket: 'test',
    baseUrl: 'test'
}


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

            let s3 = new S3(S3conf);
            let data: any = await readFile(__dirname + '/S3.ts');

            console.log('Upload file ' ,__dirname + '/S3.ts');

            ;
            
            let object: S3objectParamsI = {
                Bucket: S3conf.bucket,
                Key: 'media/S3.ts',
                ContentType: 'text/html',
                ContentLength: data.length,
                Body: data // buffer
            }

            console.log(object);


            let resp = await s3.upload(object);

            console.log(resp);

            assert.ok(true);

        }).timeout(10000);

        

    });


};

run();
