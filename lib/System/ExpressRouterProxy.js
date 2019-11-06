"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PromiseUtil_1 = require("../Utils/PromiseUtil");
class ExpressRouterProxy {
    constructor(controllerClass) {
        this.controllerClass = controllerClass;
        this.router = express_1.Router();
    }
    get(url, handlerDefinition, options) {
        this.router.get(url, async (req, res, next) => {
            await this.runMethod(handlerDefinition, req, res, next, options);
        });
    }
    post(url, handlerDefinition, options) {
        this.router.post(url, async (req, res, next) => {
            await this.runMethod(handlerDefinition, req, res, next, options);
        });
    }
    async runMethod(handlerDefinition, req, res, next, options) {
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
            const handlerResult = handler.call(ctrl, req.body, context);
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