declare class ModelOneRuleC {
    private aRule;
    constructor(sColumn: string);
    type(sType: string): ModelOneRuleC;
    if(ifType: any): ModelOneRuleC;
    require(): ModelOneRuleC;
    depend(sDepend: string): ModelOneRuleC;
    error(sError: string): ModelOneRuleC;
    errorEx(sKey: string, sError: string): ModelOneRuleC;
    def(val: any): ModelOneRuleC;
    maxLen(iVal: number): ModelOneRuleC;
    minLen(iVal: number): ModelOneRuleC;
    more(iVal: number): ModelOneRuleC;
    less(iVal: number): ModelOneRuleC;
    get(): {
        [key: string]: any;
    };
    getKey(): string;
}
export { ModelOneRuleC };
