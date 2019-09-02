import IFilter from './interfaces/IFilter';
import IReturnValuesType from './interfaces/IReturnValuesType';
import { logicalOperators, LOP_AND } from './operators/logicalOperators';
import { check } from './utils/check';
import { defaultOptions } from './utils/constants';
import { CheckError } from './utils/errors';

/**
 * Resolve whether the given conditions are matched by the given context
 *
 * @example filter
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
 * @param filter
 * @param context
 * @param options
 * @returns {object}
 */
const checkContextMatchesConditions = (filter: IFilter, context: object, options: object = defaultOptions) => {
  let returnValues: IReturnValuesType = {};
  let ignoredConditionsCollection: object[] = [];
  const formattedFilter: IFilter = formatFilter(Object.assign({}, filter));

  for (let [logicalOperator, conditions] of Object.entries(formattedFilter)) {
    if (logicalOperator in logicalOperators) {
      conditions.forEach((condition: object[]) => {
        const { status, ignoredConditions } = checkContextMatchesConditions(condition, context, options);

        if (status === false && ignoredConditions !== null) {
          ignoredConditionsCollection.push(ignoredConditions);
        } else {
          returnValues[logicalOperator] = returnValues[logicalOperator] || [];
          returnValues[logicalOperator].push(status);

          // Make sure every ignored condition is handled by pushing them in the "ignoredConditions" array, if there are any
          if (ignoredConditions) {
            ignoredConditions.forEach((ignoredCondition: object) => {
              ignoredConditionsCollection.push(ignoredCondition);
            });
          }
        }
      });
    } else {
      try {
        const checkResult = check(context, logicalOperator, conditions, options);
        formattedFilter[logicalOperator + '__result'] = checkResult;

        if (checkResult['status'] === false) {
          return {
            'status': checkResult['status'],
            'reason': checkResult['reason'],
            'ignoredConditions': ignoredConditionsCollection.length > 0 ? ignoredConditionsCollection : null,
          };
        }
      } catch (e) {
        if (e.name === 'CheckError' || e.name === 'ValueNotFound') {
          return { 'status': false, 'ignoredConditions': e.data };
        } else {
          throw e;
        }
      }
    }
  }

  if (Object.entries(returnValues).length === 0 && returnValues.constructor === Object) {
    return { 'status': true, 'ignoredConditions': ignoredConditionsCollection.length > 0 ? ignoredConditionsCollection : null };
  }

  let operatorsValues = [];
  for (let [logicalOperator, isValidConditions] of Object.entries(returnValues)) {
    operatorsValues.push(logicalOperators[logicalOperator](isValidConditions));
  }
  const isValid = logicalOperators[LOP_AND](operatorsValues);
  return {
    'status': isValid,
    'ignoredConditions': ignoredConditionsCollection.length > 0 ? ignoredConditionsCollection : null,
    'reason': !isValid ? 'Top-level "AND" condition returned false' : undefined,
  };
};

/**
 * Reformat filter passed as argument to be compliant as the example
 * @example
 * @param filter
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
export const formatFilter = (filter: IFilter) => {
  for (let [logicalOperator, conditions] of Object.entries(filter)) {
    if (logicalOperator in logicalOperators) {
      for (let i = 0; i < conditions.length; i++) {
        if (Object.keys(conditions[i]).length > 1) {
          const ruleObjectBackup = conditions[i];
          filter[logicalOperator].splice(i - 1, 1);
          for (let [rule, expected] of Object.entries(ruleObjectBackup)) {
            let newObj: IFilter = {};
            newObj[rule] = expected;
            filter[logicalOperator].push(newObj);
          }
        }
      }
    }
  }
  return filter;
};

export default checkContextMatchesConditions;
