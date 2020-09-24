import * as System from '../src';
import { initMainRequest } from '../src/System/MainRequest';

const config = require('./config.js');

const req = initMainRequest(config);

function valid(data: any) {
	const rules = new System.ModelRulesC();

	rules.set(
		rules
			.rule('array_true')
			.type(System.ModelRulesT.arrayNumbers)
			.require()
			.errorEx('array_true', 'array_true'),
	);

	rules.set(
		rules
			.rule('array_false')
			.type(System.ModelRulesT.arrayNumbers)
			.require()
			.errorEx('array_false', 'array_false'),
	);

	rules.set(
		rules
			.rule('array_decimal')
			.type(System.ModelRulesT.arrayNumbers)
			.require()
			.errorEx('array_decimal', 'array_decimal'),
	);

	rules.set(
		rules
			.rule('array_false_null')
			.type(System.ModelRulesT.arrayNumbers)
			.require()
			.errorEx('array_false_null', 'array_false_null'),
	);

	const validator = new System.ModelValidatorSys(req);
	validator.fValid(rules.get(), data);

	return validator.getResult();
}

const arrayTrue = [1, 3, 4, 5, '5'];
const arrayFalse = [1, 3, 4, 5, 'asdasd5'];
const arrayDecimal = [1.2, 3, 4, 5, '5.32323'];
const arrayFalseNull = [undefined];

const result = valid({
	array_true: arrayTrue,
	array_false: arrayFalse,
	array_decimal: arrayDecimal,
	array_false_null: arrayFalseNull,
});

console.log('valid(arrayTrue) :', result.array_true);
console.log('valid(arrayFalse) :', result.array_false);
console.log('valid(arrayDecimal) :', result.array_decimal);
console.log('valid(arrayFalseNull) :', result.array_false_null);
