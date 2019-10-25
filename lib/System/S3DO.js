"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
/**
 * Класс для роботы с S3 like
 */
class S3DO {
    constructor(conf) {
        this.conf = conf;
    }
    /**
     * Залить объект на s3
     * @param object
     */
    upload(object) {
        return new Promise((resolve, reject) => {
            new AWS.S3({
                endpoint: new AWS.Endpoint(this.conf.endpoint),
                accessKeyId: this.conf.access,
                secretAccessKey: this.conf.secret,
                s3ForcePathStyle: true
            })
                .putObject(object)
                .promise()
                .then((data) => {
                resolve(this.conf.baseUrl + '/' + object.Key);
            })
                .catch((e) => reject(e));
        });
    }
    /**
     * Получить объект
     * @param object
     */
    getObject(object) {
        return new Promise((resolve, reject) => {
            new AWS.S3({
                endpoint: new AWS.Endpoint(this.conf.endpoint),
                accessKeyId: this.conf.access,
                secretAccessKey: this.conf.secret,
                s3ForcePathStyle: true
            })
                .getObject(object)
                .promise()
                .then((data) => {
                resolve(this.conf.baseUrl + '/' + object.Key);
            })
                .catch((e) => reject(e));
        });
    }
    /**
     * поменять права доступа у объекта
     * @param object
     */
    setObjectAcl(object) {
        return new Promise((resolve, reject) => {
            new AWS.S3({
                endpoint: new AWS.Endpoint(this.conf.endpoint),
                accessKeyId: this.conf.access,
                secretAccessKey: this.conf.secret,
                s3ForcePathStyle: true
            })
                .putObjectAcl(object)
                .promise()
                .then((data) => {
                resolve(this.conf.baseUrl + '/' + object.Key);
            })
                .catch((e) => reject(e));
        });
    }
}
exports.S3DO = S3DO;
//# sourceMappingURL=S3DO.js.map