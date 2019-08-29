"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Вывод сео заголовков и прочего
 */
class SeoBase {
    constructor(req, conf) {
        this.url = req.url;
        this.conf = conf;
        this.req = req;
        this.title = this.conf.defaultTitle;
        this.description = this.conf.defaultDescription;
        this.keywords = this.conf.defaultKeywords;
        /* Open Graph */
        this.og = this.conf.defaultOg;
    }
    /**
     * Перезагрузить на дефолтные
     */
    reload() {
        this.og = this.conf.defaultOg;
    }
}
exports.SeoBase = SeoBase;
//# sourceMappingURL=Seo.js.map