import { MainRequest } from "../System/MainRequest";
/**
 * Open Graph
 */
export interface Og {
    type: string;
    site_name: string;
    title: string;
    description: string;
    url: string;
    image: string;
    imageType: string;
}
/**
 * Конфиг
 */
export interface SeoConfigI {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
    defaultOg: Og;
}
/**
 * Вывод сео заголовков и прочего
 */
export declare class SeoBase {
    protected url: string;
    protected req: MainRequest;
    title: string;
    description: string;
    keywords: string;
    og: Og;
    conf: SeoConfigI;
    constructor(req: MainRequest, conf: SeoConfigI);
    /**
     * Перезагрузить на дефолтные
     */
    reload(): void;
}
