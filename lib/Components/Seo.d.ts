import MainRequest from "../System/MainRequest";
export interface Og {
    type: string;
    site_name: string;
    title: string;
    description: string;
    url: string;
    image: string;
    imageType: string;
}
export interface SeoConfigI {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
    defaultOg: Og;
}
export declare class SeoBase {
    protected url: string;
    protected req: MainRequest;
    title: string;
    description: string;
    keywords: string;
    og: Og;
    conf: SeoConfigI;
    constructor(req: MainRequest, conf: SeoConfigI);
    reload(): void;
}
