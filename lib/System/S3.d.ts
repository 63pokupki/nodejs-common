import MainRequest from './MainRequest';
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
 * Класс для роботы с S3 like
 */
export declare class S3 {
    private conf;
    protected spacesEndpoint: any;
    constructor(req: MainRequest);
    /**
     * Залить объект на s3
     * @param object
     */
    upload(object: S3objectParamsI): Promise<string>;
}
