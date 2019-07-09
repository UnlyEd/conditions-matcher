import { conditions, DEFAULT_CONDITION, EVERY_STRING, GET_SEPARATOR, NONE_STRING, SEP_FLAG, SEP_OPERATOR, SEP_PATH, SOME_STRING } from './operators';
import { CheckError, ValueNotFound } from './errors';
import { defaultOptions, IFilter } from './conditions';

import { get } from "lodash";
/**
 * This function allows me to find in the conditions object, the target I'm looking for
 * like the call of the equal operator or the humanlyReadableAs.
 * If the operator or the target doesn't exist it throws an error.
 *
 * @param condition
 * @param target
 * @param flag
 * @return {*}
 */
export const findInConditions = (condition: string, target: string, flag: string[]) => {
  for (const key in conditions) {
    if (conditions[key].alias.includes(condition)) {
      return conditions[key][target];
    }
  }
  throw(new CheckError({
    'status': false,
    'operator': condition,
    'target': target,
    'flag': flag,
    'reason': `Error: operator: "${condition}" does not exist or doesn't have "${target}" attribute`,
  }));
};

/**
 * This cut in the key the path, the operator, and the flags
 *
 * @param key
 * @return {{path: string, flag: Array, operator: string}}
 */
export const buildArg = (key: string) => {
  const tmp = key.substring(key.indexOf(SEP_OPERATOR), key.length);
  let operator: string;
  let path: string;
  let flag: string[] = [];

  if (tmp === key) {
    operator = DEFAULT_CONDITION;
    path = key;
  } else {
    flag = tmp.split(SEP_FLAG);
    operator = flag[2];
    flag.splice(0, 3);
    path = key.substring(0, key.indexOf(SEP_OPERATOR));
  }
  while (path.includes(SEP_PATH))
    path = path.replace(SEP_PATH, GET_SEPARATOR);
  return { operator, path, flag };
};

/**
 * This function handle the every, some and none operator
 * let's take an example as key a receive school_name__every_equal and as value Skema
 * I'll loop in the given context in the "school" object looking for a key named "name" and if the operator match or not
 * I return the appropriate value. This value is push back in an array. When the loop is over
 * return the result of the array compute by the appropriate function and for every, or for some and none for none.
 *
 * @param operator
 * @param path
 * @param flag
 * @param context
 * @param value
 * @return {{reason: string, flag: *, given_value: *, expected: Array, operator: *, status: *}}
 */
export const handleComplexRequest = (operator: string, path: string, flag: string[], context: IFilter, value: any) => {
  let result: boolean[] = [];
  let match: IFilter = [];
  let tab: string[] = path.split('.');
  const tocheck: any = tab.pop();
  const expectedTab = get(context, tab.join('.'));
  const call = findInConditions(flag[0], 'call', flag);

  expectedTab.forEach((expected: any) => {
    if (typeof expected === 'undefined' || typeof value === 'undefined') {
      return {
        'status': false,
        'operator': operator,
        'given_value': value,
        'expected': expected,
        'flag': flag,
        'reason': `${status ? 'Success' : 'Fail'} because ${operator} of "${expected}" is ${status ? '' : 'not'} ${findInConditions(flag[0],'humanlyReadableAs', flag)} "${value}"`,
      };
    }
    match.push({ 'value': value, 'expected': expected[tocheck] });
    result.push(call(value, expected[tocheck], flag));
  });
  const status = findInConditions(operator, 'call', flag)(result);
  return {
    'status': status,
    'operator': operator,
    'given_value': value,
    'expected': match,
    'flag': flag,
    'reason': `${status ? 'Success' : 'Fail'} because "${match}" is ${status ? '' : 'not'} ${findInConditions(operator, 'humanlyReadableAs', flag)} "${value}"`,
  };
};

/**
 * It's the main function of the parsing first it calls the buildArg function which is explained above.
 * Second it check if the request needs a special treatment like if the operator is every, some or none
 * both of the special treatment and standard case work the same (the little differences are explained above).
 * The function got to find the expected value in the  context. Next it retrieve the call of the operator.
 * Then the operator is called and the return object is created.
 *
 * @param context
 * @param key
 * @param value
 * @param options
 * @return {{reason: string, flag: *, given_value: *, expected: Array, operator: *, status: *}|{reason: string, flag: Array, given_value: *, expected: *, operator: string, status: boolean}|{reason: string, flag: Array, given_value: *, expected: *, operator: string, status: *}}
 */
export const check = (context: object, key: string, value: any, options: any = defaultOptions) => {
  let { operator, path, flag } = buildArg(key);

  if (operator === EVERY_STRING || operator === SOME_STRING || operator === NONE_STRING) {
    return handleComplexRequest(operator, path, flag, context, value);
  }

  const expectedValue = get(context, path);

  // If the given value is not defined (missing in context), it's treated as a particular case
  if (typeof expectedValue === 'undefined') {
    if (options.strictMatch) {
      // XXX In "strict match" mode, missing values in context are treated as a match failure
      return {
        'status': false,
        'operator': operator,
        'given_value': value,
        'expected': expectedValue,
        'flag': flag,
        'reason': `'Fail because "${expectedValue}" is not ${findInConditions(operator, 'humanlyReadableAs', flag)} "${value}"`,
      };
    } else {
      // XXX In the other case, the value is considered as "missing" and a special exception is thrown
      //  This exception must be handled by the caller, and should be used to resolve whether the check fails or not (based on a group of "checks", for instance)
      throw(new ValueNotFound({
        'status': null,
        'operator': operator,
        'path': path,
        'expected': expectedValue,
        'reason': `Error: path: ${path} is not defined in context`,
      }));
    }
  }

  const call = findInConditions(operator, 'call', flag);
  const status = call(value, expectedValue, flag);

  return {
    'status': status,
    'operator': operator,
    'given_value': value,
    'expected': expectedValue,
    'flag': flag,
    'reason': `${status ? 'Success' : 'Fail'} because "${expectedValue}" is ${status ? '' : 'not'} ${findInConditions(operator, 'humanlyReadableAs', flag)} "${value}"`,
  };
};
