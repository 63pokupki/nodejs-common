"use strict";
class ModelOneRuleC {
    constructor(sColumn) {
        this.aRule = {};
        this.aRule['key'] = sColumn;
    }
    type(sType) {
        this.aRule['type'] = sType;
        return this;
    }
    if(ifType) {
        this.aRule['if'] = ifType;
        return this;
    }
    require() {
        this.aRule['require'] = true;
        return this;
    }
    depend(sDepend) {
        this.aRule['depend'] = sDepend;
        return this;
    }
    error(sError) {
        this.aRule['error'] = sError;
        return this;
    }
    errorEx(sKey, sError) {
        this.aRule['error_key'] = { key: sKey, msg: sError };
        this.error(sError);
        return this;
    }
    def(val) {
        this.aRule['def'] = val;
        return this;
    }
    maxLen(iVal) {
        this.aRule['max_len'] = iVal;
        return this;
    }
    minLen(iVal) {
        this.aRule['min_len'] = iVal;
        return this;
    }
    more(iVal) {
        this.aRule['more'] = iVal;
        return this;
    }
    less(iVal) {
        this.aRule['less'] = iVal;
        return this;
    }
    get() {
        if (!this.aRule['type']) {
            this.aRule['type'] = false;
        }
        if (!this.aRule['if']) {
            this.aRule['if'] = false;
        }
        if (!this.aRule['require']) {
            this.aRule['require'] = false;
        }
        if (!this.aRule['depend']) {
            this.aRule['depend'] = false;
        }
        if (!this.aRule['error']) {
            this.aRule['error'] = false;
        }
        return this.aRule;
    }
    getKey() {
        return this.aRule['key'];
    }
}
exports.ModelOneRuleC = ModelOneRuleC;
//# sourceMappingURL=ModelOneRuleC.js.map