"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
/**
 * Класс для роботы с S3 like
 */
class S3 {
    constructor(req) {
        this.conf = req.conf.S3;
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
                resolve(this.conf.baseUrl + this.conf.bucket + '/' + object.Key);
            })
                .catch((e) => reject(e));
        });
    }
}
exports.S3 = S3;
//# sourceMappingURL=S3.js.map