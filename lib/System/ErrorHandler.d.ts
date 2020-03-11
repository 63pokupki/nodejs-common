import * as express from 'express';
import { MainRequest } from '..';
/**
 * Обработчик ошибок выполнения
 * @param err - обязательно instanceof Error()
 * @param req
 * @param res
 * @param next
 */
export declare const fErrorHandler: (err: Error, req: MainRequest, res: express.Response<any>, next: express.NextFunction) => void;
