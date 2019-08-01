import MainRequest from './MainRequest';
export interface S3confI {
    endpoint: string;
    bucket: string;
    baseUrl: string;
}
export interface S3objectParamsI {
    Bucket: any;
    Key: string;
    ContentType: string;
    ContentLength: number;
    Body: any;
}
export declare class S3 {
    private conf;
    protected spacesEndpoint: any;
    constructor(req: MainRequest);
    upload(object: S3objectParamsI): Promise<string>;
}
