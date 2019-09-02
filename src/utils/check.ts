import { get, isUndefined, map } from 'lodash';

import conditionalOperators from '../conditionalOperators/index';
import IConditionalOperator from '../interfaces/IConditionalOperator';
import IFilter from '../interfaces/IFilter';
import IMap from '../interfaces/IMap';
import {
  DEFAULT_CONDITION,
  defaultOptions,
  EVERY_STRING,
  FLAGS_INDICATOR,
  GET_SEPARATOR,
  NONE_STRING,
  SEP_BETWEEN_OPERATOR,
  SEP_OPERATOR,
  SEP_PATH,
  SOME_STRING
} from './constants';
import { CheckError, ValueNotFound } from './errors';

/**
 * Finds the target within the "conditions" object.
 * If the conditionalOperator or the target doesn't exist, then it throws a CheckError.
 *
 * A CheckError is treated as a fatal error, similarly to a native Error.
 * It means something isn't properly configured.
 *
 * @param conditionalOperator
 * @param target
 * @param flags
 * @return {*}
 */
export const findInConditions = (conditionalOperator: string, target: string, flags: string[]) => {
  let returnValue: any = undefined;

  conditionalOperators.forEach((operatorObject: IConditionalOperator) => {
    if (operatorObject.alias.includes(conditionalOperator)) {
      returnValue = get(operatorObject, target);
    }
  });

  if (returnValue != undefined) {
    return returnValue;
  }

  throw(new CheckError({
    'status': false,
    'conditionalOperator': conditionalOperator,
    'target': target,
    'flags': flags,
    'reason': `Error: operator: "${conditionalOperator}" does not exist or doesn't have "${target}" attribute`,
  }));
};

/**
 * Resolves the "path", "operator", and "flags" from a given key
 *
 * @param rule
 * @return {{path: string, flags: Array, operator: string}}
 */
export const resolveInformationInRuleKey = (rule: string) => {
  // this cut the string and keep the conditional operator but
  // if the rules is org_name then tmp is equal org_name
  // if rules is org_name__eq tmp is equal __eq
  const tmpConditionalOperator: string = rule.substring(rule.indexOf(SEP_OPERATOR), rule.length);
  let conditionalOperator: string;
  let path: string;

  if (tmpConditionalOperator === rule) {
    conditionalOperator = DEFAULT_CONDITION;
    path = rule;
  } else {
    conditionalOperator = tmpConditionalOperator.substring(SEP_OPERATOR.length, tmpConditionalOperator.length);
    path = rule.substring(0, rule.indexOf(SEP_OPERATOR));
  }

  while (path.includes(SEP_PATH)) {
    path = path.replace(SEP_PATH, GET_SEPARATOR);
  }

  return { conditionalOperator, path };
};

/**
 * this function resolve the complex Conditional Operator aka every, some, none
 * and the conditional Operator aka eq, gt, etc...
 * @param operators
 */
export const resolveComplexOperator = (operators: string) => {
  let complexConditionalOperator: string = operators.substring(0, operators.indexOf(SEP_BETWEEN_OPERATOR));
  let conditionalOperator: string = operators.substring(operators.indexOf(SEP_BETWEEN_OPERATOR), operators.length);

  if (!complexConditionalOperator) {
    complexConditionalOperator = conditionalOperator;
    conditionalOperator = DEFAULT_CONDITION;
  }

  if (conditionalOperator[0] == '_') {
    conditionalOperator = conditionalOperator.substr(1);
  }

  return {
    complexConditionalOperator,
    conditionalOperator
  };
};

/**
 * Handles every, some and none operators
 * Not used for "simple" operators, only for complex ones (for arrays/objects)
 *
 * @example
 *  Given a key as "school_name__every_equal"
 *  Given a value as "Skema"
 *  The algorithm will first find the "school.name" value, then it'll loop over every value and
 *
 * This value is push back in an array. When the loop is over
 * return the result of the array compute by the appropriate function and for every, or for some and none for none.
 *
 * @param operators
 * @param path
 * @param context
 * @param givenValue
 * @param options
 * @return {{reason: string, flags: *, given_value: *, valueInContext: Array, operator: *, status: *}}
 */

export const handleComplexRequest = (operators: string, path: string, context: IFilter, givenValue: any, options: IMap) => {
  const { complexConditionalOperator, conditionalOperator } = resolveComplexOperator(operators);
  let flags: string[] = [];
  let results: boolean[] = [];
  let matches: IFilter = [];
  let splitPath: string[] = path.split(GET_SEPARATOR);
  const fieldKeyToCheck: any = splitPath.pop();
  const resolvedContextFieldValue = get(context, splitPath.join(GET_SEPARATOR));
  const callback = findInConditions(conditionalOperator, 'callback', flags);
  if (isUndefined(resolvedContextFieldValue)) {
    if (options['strictMatch'] === true) {
      // XXX In "strict match" mode, missing values in context are treated as a match failure
      return {
        'status': false,
        'is_ignored': true,
        'complex_operator': complexConditionalOperator,
        'conditionalOperator': conditionalOperator,
        'given_value': givenValue,
        'valueInContext': undefined,
        'flags': flags,
        'reason': 'Fail because value not found in context',
      };
    } else {
      // XXX In the other case, the value is considered as "missing" and a special exception is thrown
      //  This exception must be handled by the caller, and should be used to resolve whether the check fails or not (based on a group of "checks", for instance)
      throw(new ValueNotFound({
        'status': null,
        'complex_operator': complexConditionalOperator,
        'conditionalOperator': conditionalOperator,
        'path': path,
        'valueInContext': undefined,
        'reason': `Error: path: ${path} is not defined in context`,
      }));
    }
  }
  map(resolvedContextFieldValue, (valueInContext: IMap) => {
    flags = get(valueInContext, fieldKeyToCheck + FLAGS_INDICATOR, []);
    if (isUndefined(valueInContext) || isUndefined(givenValue)) {
      return {
        'status': false,
        'complex_operator': complexConditionalOperator,
        'conditionalOperator': conditionalOperator,
        'given_value': givenValue,
        'valueInContext': valueInContext,
        'flags': flags,
        'reason': `Fail because ${complexConditionalOperator} of "${valueInContext}" is not ${findInConditions(conditionalOperator, 'humanlyReadableAs', flags)} "${givenValue}"`,
      };
    }
    matches.push({ 'value': givenValue, 'valueInContext': valueInContext[fieldKeyToCheck] });
    results.push(callback(givenValue, valueInContext[fieldKeyToCheck], flags));
  });

  const isSuccess = findInConditions(complexConditionalOperator, 'callback', flags)(results);
  return {
    'status': isSuccess,
    'operator': complexConditionalOperator,
    'given_value': givenValue,
    'valueInContext': matches,
    'flags': flags,
    'reason': `${isSuccess ? 'Success' : 'Fail'} because ${findInConditions(complexConditionalOperator, 'humanlyReadableAs', flags)} of "${JSON.stringify(matches)}" is ${isSuccess ? '' : 'not'}  "${givenValue}"`,
  };
};

/**
 * It's the main function of the parsing first it calls the buildArg function which is explained above.
 * Second it check if the request needs a special treatment like if the operator is every, some or none
 * both of the special treatment and standard case work the same (the little differences are explained above).
 * The function got to find the valueInContext value in the  context. Next it retrieve the callback of the operator.
 * Then the operator is called and the return object is created.
 *
 * @param context
 * @param rule
 * @param value
 * @param options
 */
export const check = (context: object, rule: string, value: any, options: IMap = defaultOptions) => {
  let { conditionalOperator, path } = resolveInformationInRuleKey(rule);

  if (conditionalOperator.includes(EVERY_STRING) || conditionalOperator.includes(SOME_STRING) || conditionalOperator.includes(NONE_STRING)) {
    return handleComplexRequest(conditionalOperator, path, context, value, options);
  }

  const valueInContext: any = get(context, path);
  const flags: string[] = get(context, path + FLAGS_INDICATOR, []);

  // If the given value is not defined (missing in context), it's treated as a particular case
  if (isUndefined(valueInContext)) {
    if (options['strictMatch'] === true) {
      // XXX In "strict match" mode, missing values in context are treated as a match failure
      return {
        'status': false,
        'rule': rule,
        'conditionalOperator': conditionalOperator,
        'given_value': value,
        'valueInContext': valueInContext,
        'flags': flags,
        'reason': `'Fail because "${valueInContext}" is not ${findInConditions(conditionalOperator, 'humanlyReadableAs', flags)} "${value}"`,
      };
    } else {
      // XXX In the other case, the value is considered as "missing" and a special exception is thrown
      //  This exception must be handled by the caller, and should be used to resolve whether the check fails or not (based on a group of "checks", for instance)
      throw(new ValueNotFound({
        'status': null,
        'rule': rule,
        'conditionalOperator': conditionalOperator,
        'path': path,
        'valueInContext': valueInContext,
        'reason': `Error: path: ${path} is not defined in context`,
      }));
    }
  }

  const callback = findInConditions(conditionalOperator, 'callback', flags);
  const isSuccess = callback(value, valueInContext, flags);

  return {
    'status': isSuccess,
    'rule': rule,
    'operator': conditionalOperator,
    'given_value': value,
    'valueInContext': valueInContext,
    'flags': flags,
    'reason': `${isSuccess ? 'Success' : 'Fail'} because "${valueInContext}" is ${isSuccess ? '' : 'not'} ${findInConditions(conditionalOperator, 'humanlyReadableAs', flags)} "${value}"`,
  };
};
