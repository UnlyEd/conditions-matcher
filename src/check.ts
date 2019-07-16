import { get } from "lodash";

import { conditions, DEFAULT_CONDITION, EVERY_STRING, GET_SEPARATOR, NONE_STRING, SEP_FLAG, SEP_OPERATOR, SEP_PATH, SOME_STRING } from './operators';
import { CheckError, ValueNotFound } from './errors';
import { defaultOptions, IFilter } from './conditions';

/**
 * Finds the target within the "conditions" object.
 * If the operator or the target doesn't exist, then it throws a CheckError.
 *
 * A CheckError is treated as a fatal error, similarly to a native Error.
 * It means something isn't properly configured.
 *
 * @param condition
 * @param target
 * @param flags
 * @return {*}
 */
export const findInConditions = (condition: string, target: string, flags: string[]) => {
  for (const key in conditions) {
    if (conditions[key].alias.includes(condition)) {
      return conditions[key][target];
    }
  }

  throw(new CheckError({
    'status': false,
    'operator': condition,
    'target': target,
    'flags': flags,
    'reason': `Error: operator: "${condition}" does not exist or doesn't have "${target}" attribute`,
  }));
};

/**
 * Resolves the "path", "operator", and "flags" from a given key
 *
 * @param rule
 * @return {{path: string, flags: Array, operator: string}}
 */
export const buildArg = (rule: string) => {
  const tmp = rule.substring(rule.indexOf(SEP_OPERATOR), rule.length);
  let operator: string;
  let path: string;
  let flags: string[] = [];

  if (tmp === rule) {
    operator = DEFAULT_CONDITION;
    path = rule;

  } else {
    flags = tmp.split(SEP_FLAG);
    operator = flags[2];
    flags.splice(0, 3);
    path = rule.substring(0, rule.indexOf(SEP_OPERATOR));
  }

  while (path.includes(SEP_PATH)) {
    path = path.replace(SEP_PATH, GET_SEPARATOR);
  }

  return { operator, path, flags };
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
 * @param flags
 * @param context
 * @param value
 * @return {{reason: string, flags: *, given_value: *, expected: Array, operator: *, status: *}}
 */
export const handleComplexRequest = (operator: string, path: string, flags: string[], context: IFilter, value: any) => {
  let result: boolean[] = [];
  let match: IFilter = [];
  let tab: string[] = path.split('.');
  const tocheck: any = tab.pop();
  const expectedTab = get(context, tab.join('.'));
  const call = findInConditions(flags[0], 'call', flags);

  expectedTab.forEach((expected: any) => {
    if (typeof expected === 'undefined' || typeof value === 'undefined') {
      return {
        'status': false,
        'operator': operator,
        'given_value': value,
        'expected': expected,
        'flags': flags,
        'reason': `${status ? 'Success' : 'Fail'} because ${operator} of "${expected}" is ${status ? '' : 'not'} ${findInConditions(flags[0], 'humanlyReadableAs', flags)} "${value}"`,
      };
    }
    match.push({ 'value': value, 'expected': expected[tocheck] });
    result.push(call(value, expected[tocheck], flags));
  });
  const status = findInConditions(operator, 'call', flags)(result);
  return {
    'status': status,
    'operator': operator,
    'given_value': value,
    'expected': match,
    'flags': flags,
    'reason': `${status ? 'Success' : 'Fail'} because "${match}" is ${status ? '' : 'not'} ${findInConditions(operator, 'humanlyReadableAs', flags)} "${value}"`,
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
 * @param rule
 * @param value
 * @param options
 */
export const check = (context: object, rule: string, value: any, options: any = defaultOptions) => {
  let { operator, path, flags } = buildArg(rule);

  if (operator === EVERY_STRING || operator === SOME_STRING || operator === NONE_STRING) {
    return handleComplexRequest(operator, path, flags, context, value);
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
        'flags': flags,
        'reason': `'Fail because "${expectedValue}" is not ${findInConditions(operator, 'humanlyReadableAs', flags)} "${value}"`,
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

  const call = findInConditions(operator, 'call', flags);
  const status = call(value, expectedValue, flags);

  return {
    'status': status,
    'operator': operator,
    'given_value': value,
    'expected': expectedValue,
    'flags': flags,
    'reason': `${status ? 'Success' : 'Fail'} because "${expectedValue}" is ${status ? '' : 'not'} ${findInConditions(operator, 'humanlyReadableAs', flags)} "${value}"`,
  };
};
