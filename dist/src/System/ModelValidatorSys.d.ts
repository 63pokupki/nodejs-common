import MainRequest from '../System/MainRequest';
import { ErrorSys } from './ErrorSys';
export declare class ModelValidatorSys {
    protected okResult: boolean;
    protected abValidOK: any;
    protected data: any;
    protected aResult: any;
    protected aResultType: any;
    protected aMsg: string[];
    protected errorSys: ErrorSys;
    constructor(req: MainRequest);
    protected fValidString(sKey: string, sTpl: RegExp): boolean;
    protected fValidText(sKey: string): boolean;
    protected fValidBool(sKey: string): boolean;
    protected fValidInt(sKey: string): boolean;
    protected fValidDecimal(sKey: string): boolean;
    protected fValidEnum(sKey: string, aEnumList: any[]): boolean;
    protected fValidJson(sKey: string): boolean;
    protected fValidObject(sKey: string): boolean;
    protected fValidArray(sKey: string): boolean;
    protected fValidMore(sKey: string, iVal: number): boolean;
    protected fValidLess(sKey: string, iVal: number): boolean;
    protected fValidMaxLen(sKey: string, iLen: number): boolean;
    protected fValidMinLen(stringKey: string, checkValue: number): boolean;
    getResult(): {
        [key: string]: any;
    } | any;
    getStatus(): boolean;
    getMsg(): string[];
    fValid(aRules: any, data: {
        [key: string]: any;
    }): boolean;
}
