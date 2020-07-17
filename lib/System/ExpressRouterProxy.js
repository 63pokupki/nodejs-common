"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressRouterProxy = void 0;
const express_1 = require("express");
const PromiseUtil_1 = require("../Utils/PromiseUtil");
/**
 * Оборачивает в try/catch создание контроллера и вызов обработчика роута,
 * чтобы не приходилось это делать в коде каждого обработчика роута
 *
 * По умолчанию отправляет в ответ сериализованное значение возвращенное обработчиком
 * Но можно отнаследоваться и переопределить метод buildResponse, чтобы изменить логику ответа
 *
 * По умолчанию если передан класс контроллера, то экземпляр класса контроллера создается через new
 * но можно изменить логику инициализации контроллера перед вызовом обработчика
 * переопределив метод initializeController
 * в нем можно добавить дополнительные действия по инициализации, например проверку прав доступа
 */
class ExpressRouterProxy {
    constructor(controllerClass) {
        this.controllerClass = controllerClass;
        this.router = express_1.Router();
    }
    get(url, handlerDefinition, options) {
        this.router.get(url, async (req, res, next) => {
            await this.runMethod(handlerDefinition, req.params, req, res, next, options);
        });
    }
    post(url, handlerDefinition, options) {
        this.router.post(url, async (req, res, next) => {
            await this.runMethod(handlerDefinition, req.body, req, res, next, options);
        });
    }
    async runMethod(handlerDefinition, data, req, res, next, options) {
        try {
            const ctrl = await this.initializeController(req, res, next, options);
            const context = {
                req,
                res,
                next,
                ctrl,
                options,
            };
            const handler = handlerDefinition(ctrl);
            const handlerResult = handler.call(ctrl, data, context);
            const responseData = await PromiseUtil_1.promisify(handlerResult);
            await this.buildResponse(responseData, context);
            if (!res.headersSent) { // Check if response was provided
                next(new Error('No content'));
            }
            else {
                next();
            }
        }
        catch (error) {
            next(error);
        }
    }
    initializeController(req, res, next, options) {
        const { controllerClass: CtrlCtor } = this;
        if (!CtrlCtor) {
            return Promise.resolve(null);
        }
        return Promise.resolve(new CtrlCtor(req, res));
    }
    buildResponse(responseData, context) {
        context.res.send(JSON.stringify(responseData));
        return Promise.resolve();
    }
}
exports.ExpressRouterProxy = ExpressRouterProxy;
//# sourceMappingURL=ExpressRouterProxy.js.map