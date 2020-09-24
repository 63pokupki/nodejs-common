import { S3confI } from './MainConfig';
/**
 * Параметры объекта для заливки
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
 */
export interface S3objectParamsI {
    Bucket: any;
    Key: string;
    ContentType: string;
    ContentLength: number;
    Body: any;
    GrantFullControl?: string;
    ACL?: string;
    GrantRead?: string;
    GrantReadACP?: string;
    GrantWriteACP?: string;
    CacheControl?: string;
    Metadata?: {
        [key: string]: string;
    };
}
/**
 * Параметры объекта для получения файла
 */
export interface getS3objectParamsI {
    Bucket: any;
    Key: string;
}
/**
 * Параметры объекта для смены типа приватности
 */
export interface setS3objectAclParamsI {
    Bucket: any;
    Key: string;
    ACL?: string;
}
/**
 * Класс для роботы с S3 like
 */
export declare class S3DO {
    private conf;
    protected spacesEndpoint: any;
    constructor(conf: S3confI);
    /**
     * Залить объект на s3
     * @param object
     */
    upload(object: S3objectParamsI): Promise<string>;
    /**
     * Получить объект
     * @param object
     */
    getObject(object: getS3objectParamsI): Promise<string>;
    /**
     * поменять права доступа у объекта
     * @param object
     */
    setObjectAcl(object: setS3objectAclParamsI): Promise<string>;
}
