import * as System from '../src';
import { initMainRequest } from '../src/System/MainRequest';

const config = require('./config.js');

const req = initMainRequest(config);

function valid(data: any) {
	const rules = new System.ModelRulesC();

	rules.set(rules.rule('enum_boolean_true_1')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 0])
		.errorEx('enum_boolean_true_1', 'enum_boolean_true_1'));

	rules.set(rules.rule('enum_boolean_true_2')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 0])
		.errorEx('enum_boolean_true_2', 'enum_boolean_true_2'));

	rules.set(rules.rule('enum_boolean_true_3')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 0])
		.errorEx('enum_boolean_true_3', 'enum_boolean_true_3'));

	rules.set(rules.rule('enum_boolean_true_4')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 0])
		.errorEx('enum_boolean_true_4', 'enum_boolean_true_4'));

	rules.set(rules.rule('enum_boolean_false_1')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 0])
		.errorEx('enum_boolean_false_1', 'enum_boolean_false_1'));

	rules.set(rules.rule('enum_boolean_false_2')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 0])
		.errorEx('enum_boolean_false_2', 'enum_boolean_false_2'));

	rules.set(rules.rule('enum_boolean_false_3')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 0])
		.errorEx('enum_boolean_false_3', 'enum_boolean_false_3'));

	// =============================================
	// NUMBER

	rules.set(rules.rule('enum_number_true_1')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 2])
		.errorEx('enum_number_true_1', 'enum_number_true_1'));

	rules.set(rules.rule('enum_number_true_2')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 2])
		.errorEx('enum_number_true_2', 'enum_number_true_2'));

	rules.set(rules.rule('enum_number_false_1')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 2])
		.errorEx('enum_number_false_1', 'enum_number_false_1'));

	rules.set(rules.rule('enum_number_false_1')
		.type(System.ModelRulesT.enum)
		.require()
		.if([1, 2])
		.errorEx('enum_number_false_1', 'enum_number_false_1'));

	// =================================================
	// STRING

	rules.set(rules.rule('enum_string_true_1')
		.type(System.ModelRulesT.enum)
		.require()
		.if(['s1', 's2', '1'])
		.errorEx('enum_string_true_1', 'enum_string_true_1'));

	rules.set(rules.rule('enum_string_false_1')
		.type(System.ModelRulesT.enum)
		.require()
		.if(['s1', 's2', '1'])
		.errorEx('enum_string_false_1', 'enum_string_false_1'));

	rules.set(rules.rule('enum_string_false_2')
		.type(System.ModelRulesT.enum)
		.require()
		.if(['s1', 's2', '1'])
		.errorEx('enum_string_false_2', 'enum_string_false_2'));

	rules.set(rules.rule('enum_string_false_3')
		.type(System.ModelRulesT.enum)
		.require()
		.if(['s1', 's2', '1'])
		.errorEx('enum_string_false_3', 'enum_string_false_3'));

	const validator = new System.ModelValidatorSys(req);
	validator.fValid(rules.get(), data);

	return validator.getResult();
}

const result = valid({
	enum_boolean_true_1: true,
	enum_boolean_true_2: false,
	enum_boolean_true_3: '1',
	enum_boolean_true_4: '0',
	enum_boolean_false_1: '3',
	enum_boolean_false_2: 's1',
	enum_boolean_false_3: '-3',

	enum_number_true_1: 1,
	enum_number_true_2: '1',
	enum_number_true_3: '0',
	enum_number_false_1: 's1',

	enum_string_true_1: 's1',
	enum_string_false_1: null,
	enum_string_false_2: undefined,
	enum_string_false_3: '1',
});
console.log('======================================');
console.log('===enum_boolean_true_1>', result.enum_boolean_true_1);
console.log('===enum_boolean_true_2>', result.enum_boolean_true_2);
console.log('===enum_boolean_true_3>', result.enum_boolean_true_3);
console.log('===enum_boolean_true_4>', result.enum_boolean_true_4);
console.log('===enum_boolean_false_1>', result.enum_boolean_false_1);
console.log('===enum_boolean_false_2>', result.enum_boolean_false_2);
console.log('===enum_boolean_false_3>', result.enum_boolean_false_3);
console.log('======================================');
console.log('===enum_number_true_1>', result.enum_number_true_1);
console.log('===enum_number_true_2>', result.enum_number_true_2);
console.log('===enum_number_false_1>', result.enum_number_false_1);
console.log('======================================');
console.log('===enum_string_true_1>', result.enum_string_true_1);
console.log('===enum_string_false_1>', result.enum_string_false_1);
console.log('===enum_string_false_2>', result.enum_string_false_2);
console.log('===enum_string_false_3>', result.enum_string_false_3);
console.log('======================================');
