"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3 = void 0;
const AWS = __importStar(require("aws-sdk"));
/**
 * Класс для роботы с S3 like
 */
class S3 {
    constructor(req) {
        this.conf = req.conf.S3DO;
    }
    /**
     * Залить объект на s3
     * @param object
     */
    upload(object) {
        return new Promise((resolve, reject) => {
            new AWS.S3({
                endpoint: (new AWS.Endpoint(this.conf.endpoint)).host,
                accessKeyId: this.conf.access,
                secretAccessKey: this.conf.secret,
                s3ForcePathStyle: true,
            })
                .putObject(object)
                .promise()
                .then((data) => {
                resolve(`${this.conf.baseUrl + this.conf.bucket}/${object.Key}`);
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
                endpoint: (new AWS.Endpoint(this.conf.endpoint)).host,
                accessKeyId: this.conf.access,
                secretAccessKey: this.conf.secret,
                s3ForcePathStyle: true,
            })
                .getObject(object)
                .promise()
                .then((data) => {
                resolve(`${this.conf.baseUrl + this.conf.bucket}/${object.Key}`);
            })
                .catch((e) => reject(e));
        });
    }
}
exports.S3 = S3;
//# sourceMappingURL=S3.js.map