import { P63Context } from "../System/P63Context";


/**
 * Open Graph
 */
export interface Og {
	type: string; // 'website'
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
export class SeoBase {
	protected url: string; // входящий url

	protected ctx: P63Context;

	public title: string;

	public description: string;

	public keywords: string;

	public og: Og;

	public conf: SeoConfigI;

	constructor(ctx: P63Context, conf: SeoConfigI) {
		this.url = ctx.req.url;
		this.conf = conf;
		this.ctx = ctx;

		this.title = this.conf.defaultTitle;
		this.description = this.conf.defaultDescription;
		this.keywords = this.conf.defaultKeywords;

		/* Open Graph */
		this.og = this.conf.defaultOg;
	}

	/**
     * Перезагрузить на дефолтные
     */
	public reload(): void {
		this.og = this.conf.defaultOg;
	}
}
