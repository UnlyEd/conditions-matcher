import { check } from './check';
import { and, not, or } from './operators';
import { CheckError } from './errors';

interface IReturnValuesType {
  [key: string]: boolean[]
}

export interface IFilter {
  [key: string]: any
}

interface IOperators {
  [key: string]: any
}
const operators: IOperators = {
  'AND': and,
  'OR': or,
  'NOT': not,
};

export const defaultOptions = {
  'strictMatch': false,
};

/**
 * Resolve whether the given conditions are matched by the given context
 *
 * @example filters
 *      {
          'AND': [
            {
              'organisation_name': 'skema',
              'institution_name': 'skema',
              'campus_name': 'paris',
            },
          ],
          'organisation_name': 'skema',
        }
 *
 * @example context
 *      {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'skema',
          },
          campus: {
            name: 'not-paris',
          },
        }
 *
 * @param filters
 * @param context
 * @param options
 * @returns {object}
 */
const checkContextMatchesConditions = (filters: IFilter, context: object, options: object = defaultOptions) => {
  let returnValues: IReturnValuesType = {};
  let ignoredConditionsArr: object[] = [];
  filters = formatFilters(Object.assign({}, filters));

  for (let [key, value] of Object.entries(filters)) {
    if (key in operators) {
      value.forEach((condition: object[]) => {
        const { status, ignoredConditions } = checkContextMatchesConditions(condition, context, options);

        if (status === false && ignoredConditions !== null) {
          ignoredConditionsArr.push(ignoredConditions);
        } else {
          returnValues[key] = returnValues[key] || [];
          returnValues[key].push(status);
        }
      });
    } else {
      try {
        const result = check(context, key, value, options);
        filters[key + '__result'] = result;

        if (result['status'] === false) {
          return {
            'status': result['status'],
            'reason': result['reason'],
            'ignoredConditions': ignoredConditionsArr.length > 0 ? ignoredConditionsArr : null,
          };
        }
      } catch (e) {
        if (e.name === 'CheckError') {
          return { 'status': false, 'ignoredConditions': e.data };
        }
        if (e.name === 'ValueNotFound') {
          return { 'status': false, 'ignoredConditions': e.data };
        } else {
          throw e;
        }
      }
    }
  }

  if (Object.entries(returnValues).length === 0 && returnValues.constructor === Object) {
    return { 'status': true, 'ignoredConditions': ignoredConditionsArr.length > 0 ? ignoredConditionsArr : null };
  }

  let operatorsValues = [];
  for (let [key, value] of Object.entries(returnValues)) {
    operatorsValues.push(operators[key](value));
  }
  const returnStatus = and(operatorsValues);
  return {
    'status': returnStatus,
    'ignoredConditions': ignoredConditionsArr.length > 0 ? ignoredConditionsArr : null,
    'reason': !returnStatus ? 'Top-level "AND" condition returned false' : null,
  };
};

/**
 * Reformat filter passed as argument to be compliant as the example
 * @example
 * @param filters
 *    {
        'AND': [
          {
            'organisation_name': 'skema'
          },{
            'institution_name': 'skema',
          },{
            'campus_name': 'paris',
          },
        ],
        'organisation_name': 'skema',
       }
 * @returns {array}
 */
export const formatFilters = (filters: IFilter) => {
  for (let [key, value] of Object.entries(filters)) {
    if (key in operators) {
      for (let i = 0; i < value.length; i++) {

        if (Object.keys(value[i]).length > 1) {
          const ruleObjectBackup = value[i];
          filters[key].splice(i - 1, 1);

          for (let [rule, expected] of Object.entries(ruleObjectBackup)) {
            let newObj:IFilter = {};

            newObj[rule] = expected;
            filters[key].push(newObj);
          }
        }
      }
    }
  }
  return filters;
};

export default checkContextMatchesConditions;
