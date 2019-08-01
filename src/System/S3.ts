import MainRequest from './MainRequest';
const AWS = require('aws-sdk');

/**
 * Подключение
 */
export interface S3confI {
    endpoint: string;
    bucket: string;
    baseUrl: string;
}

/**
 * Параметры объекта для заливки
 */
export interface S3objectParamsI {
    Bucket: any,
    Key: string,
    ContentType: string,
    ContentLength: number,
    Body: any // buffer
}


/**
 * Класс для роботы с S3 like
 */
export class S3 {

    private conf: S3confI;

    protected spacesEndpoint: any;

    constructor(req: MainRequest) {
        this.conf = <S3confI>req.conf.S3;
    }

    /**
     * Залить объект на s3
     * @param object 
     */
    upload(object: S3objectParamsI): Promise<string> {
        return new Promise((resolve, reject) => {
            new AWS.S3({ endpoint: new AWS.Endpoint(this.conf.endpoint) })
                .putObject(object)
                .promise()
                .then((data: any) => {
                    resolve(this.conf.baseUrl + object.Key);
                })
                .catch((e: any) => reject(e));
        })
    }

}