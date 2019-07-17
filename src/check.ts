import { get, map } from "lodash";

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
 * @param operator
 * @param target
 * @param flags
 * @return {*}
 */
export const findInConditions = (operator: string, target: string, flags: string[]) => {
  for (const key in conditions) {
    if (conditions[key].alias.includes(operator)) {
      return conditions[key][target];
    }
  }

  throw(new CheckError({
    'status': false,
    'operator': operator,
    'target': target,
    'flags': flags,
    'reason': `Error: operator: "${operator}" does not exist or doesn't have "${target}" attribute`,
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
 * Handles every, some and none operators
 * Not used for "simple" operators, only for complex ones (for arrays/objects)
 *
 * @example TODO retravailler ça, matelos !
 *  Given a key as "school_name__every_equal"
 *  Given a value as "Skema"
 *  The algorithm will first find the "school.name" value, then it'll loop over every value and
 *
 * This value is push back in an array. When the loop is over
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
  let results: boolean[] = [];
  let matches: IFilter = [];
  let tmpArray: string[] = path.split('.');
  const fieldKeyToCheck: any = tmpArray.pop();
  const resolvedContextFieldValue = get(context, tmpArray.join('.'));
  const call = findInConditions(flags[0], 'call', flags);

  map(resolvedContextFieldValue, (expected: any) => {
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
    matches.push({ 'value': value, 'expected': expected[fieldKeyToCheck] });
    results.push(call(value, expected[fieldKeyToCheck], flags));
  });

  const status = findInConditions(operator, 'call', flags)(results);
  return {
    'status': status,
    'operator': operator,
    'given_value': value,
    'expected': matches,
    'flags': flags,
    'reason': `${status ? 'Success' : 'Fail'} because "${matches}" is ${status ? '' : 'not'} ${findInConditions(operator, 'humanlyReadableAs', flags)} "${value}"`,
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
