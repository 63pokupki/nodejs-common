import MainRequest from './MainRequest';
const AWS = require('aws-sdk');

/**
 * Подключение
 */
export interface S3confI {
    endpoint: string;
    bucket: string;
    baseUrl: string;
    access: string;
    secret: string;
}

/**
 * Параметры объекта для заливки
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
 */
export interface S3objectParamsI {
    Bucket: any;
    Key: string;
    ContentType: string;
    ContentLength: number;
    Body: any; // Buffer.from
    GrantFullControl?: string;
    ACL?: string; // private | public-read | public-read-write | authenticated-read | aws-exec-read | bucket-owner-read | bucket-owner-full-control
    GrantRead?: string;
    GrantReadACP?: string;
    GrantWriteACP?: string;
    CacheControl?: string;
    Metadata?: { [key: string]: string };
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
            new AWS.S3({
                endpoint: new AWS.Endpoint(this.conf.endpoint),
                accessKeyId: this.conf.access,
                secretAccessKey: this.conf.secret,
                s3ForcePathStyle: true
            })
                .putObject(object)
                .promise()
                .then((data: any) => {
                    resolve(this.conf.baseUrl + this.conf.bucket + '/' + object.Key);
                })
                .catch((e: any) => reject(e));
        })
    }

}