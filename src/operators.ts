import { deepStrictEqual } from 'assert';
import { map } from "lodash";

import { CheckError } from './errors';
import { IFilter } from "./conditions";
import { type } from "os";

export const SEP_OPERATOR = '__';
export const SEP_BETWEEN_OPERATOR = '_';
export const SEP_PATH = '_';
export const DEFAULT_CONDITION = 'equals';
export const GET_SEPARATOR = '.';
export const EVERY_STRING = 'every';
export const SOME_STRING = 'some';
export const NONE_STRING = 'none';
export const FLAGS_INDICATOR = "__flags";

export const and = (values: boolean[]) => {
  return values.filter(returnValue => !returnValue).length === 0;
};

export const or = (values: boolean[]) => {
  return values.filter(returnValue => returnValue).length > 0;
};

export const not = (values: boolean[]) => {
  return values.filter(returnValue => returnValue).length === 0;
};

export const conditions: IFilter = { // TODO rename handlers?
  'every': {
    'alias': ['every'],
    'call': (value: any) => {
      return and(value);
    },
    'humanlyReadableAs': 'every',
  },

  'some': {
    'alias': ['some'],
    'call': (value: any) => {
      return or(value);
    },
    'humanlyReadableAs': 'some',
  },

  'none': {
    'alias': ['none'],
    'call': (value: any) => {
      return not(value);
    },
    'humanlyReadableAs': 'none',
  },

  'startsWith': {
    'alias': ['startsWith', 'sw'],
    'call': (value: any, contextValue: any, flags: string[]) => {
      if (typeof value === 'string' && typeof contextValue === 'string') {
        if (flags.includes('i')) {
          const tmp = contextValue.toLowerCase();
          return tmp.startsWith(value.toLowerCase());
        }
        return contextValue.startsWith(value);
      }
      return false;
    },
    'humanlyReadableAs': 'starts with',
  },

  'endsWith': {
    'alias': ['endsWith', 'ew'],
    'call': (value: any, contextValue: any, flags: string[]) => {
      if (typeof value === 'string' && typeof contextValue === 'string') {
        if (flags.includes('i')) {
          const tmp = contextValue.toLowerCase();
          return tmp.endsWith(value.toLowerCase());
        }
        return contextValue.endsWith(value);
      }
      return false;
    },
    'humanlyReadableAs': 'ends with',
  },

  'equals':
    {
      'alias': ['equals', 'eq'],
      'call': (value: any, contextValue: any, flags: string[]) => {
        console.log(value, contextValue, flags)
        if (typeof value === typeof contextValue) {
          if (typeof value === 'object' || typeof contextValue === 'object') {
            try {
              deepStrictEqual(value, contextValue);
              return true;
            } catch (e) {
              console.log(e);
              return false;
            }
          }
          if (flags.includes('i')) {
            return value.toLowerCase() === contextValue.toLowerCase();
          }
          return value === contextValue;
        }
        return false;
      },
      'humanlyReadableAs': 'equal',
    },
  'notEquals':
    {
      'alias': ['ne', 'notEquals'],
      'call': (value: any, contextValue: any, flags: string[]) => {
        if (typeof value === 'object' || typeof contextValue === 'object') {
          try {
            deepStrictEqual(value, contextValue);
            return false;

          } catch (_) {
            return true;
          }
        }
        if (flags.includes('i')) {
          return value.toLowerCase() !== contextValue.toLowerCase();
        }
        return value !== contextValue;
      },
      'humanlyReadableAs': 'not',
    },

  'contains':
    {
      'alias': ['contains', 'includes', 'in'],
      'call': (value: any, contextValue: any, flags: string[]) => {
        if (typeof value === 'object' && typeof contextValue === 'object') {
          for (const el in value) {
            if (contextValue.hasOwnProperty(el) && (contextValue[el] !== value[el])) {
              return false;
            }
          }
          return true;
        }
        if (typeof value === 'string' && typeof contextValue === 'string') {
          if (flags.includes('i')) {
            return contextValue.toLowerCase().search(value.toLowerCase()) >= 0;
          }
          return contextValue.search(value) >= 0;
        }
        if (flags.includes('i')) {
          return value.filter((el: string) => el.toLowerCase()).includes(contextValue.toLowerCase());
        }
        return value.includes(contextValue);
      },
      'humanlyReadableAs': 'in',
    },

  'notContains':
    {
      'alias': ['notContains', 'not_includes', 'nin'],
      'call': (value: any, contextValue: any, flags: string[]) => {
        if (typeof value === 'string' && typeof contextValue === 'string') {
          if (flags.includes('i')) {
            return contextValue.toLowerCase().search(value.toLowerCase()) === -1;
          }
          return contextValue.search(value) === -1;
        }
        if (typeof value === 'object') {
          if (flags.includes('i')) {
            return !value.map((el: any) => {
              if (typeof el === 'string') {
                return el.toLowerCase();
              }
              return el;
            }).includes(contextValue.toLowerCase());
          } else {
            return !value.includes(contextValue);
          }
        }
        throw(new CheckError({
          'status': false,
          'operator': 'notContains',
          'given_value': value,
          'contextValue': contextValue,
          'flags': flags,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof contextValue} is not handle`,
        }));

      },
      'humanlyReadableAs': 'not in',
    },

  'greaterThan':
    {
      'alias': ['greaterThan', 'gt'],
      'call': (value: any, contextValue: any, flags: string[]) => {
        if (typeof value === 'number' && typeof contextValue === 'number') {
          return value < contextValue;
        }
        throw(new CheckError({
          'status': false,
          'operator': 'greaterThan',
          'given_value': value,
          'contextValue': contextValue,
          'flags': flags,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof contextValue} is not handle`,
        }));
      },
      'humanlyReadableAs': 'greaterThan than',
    },

  'greaterThanEquals':
    {
      'alias': ['greaterThanEquals', 'gte'],
      'call': (value: any, contextValue: any, flags: string[]) => {
        if (typeof value === 'number' && typeof contextValue === 'number') {
          return value <= contextValue;
        }
        throw(new CheckError({
          'status': false,
          'operator': 'greaterThanEquals',
          'given_value': value,
          'contextValue': contextValue,
          'flags': flags,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof contextValue} is not handle`,
        }));
      },
      'humanlyReadableAs': 'greater or equal than',
    },

  'lessThan':
    {
      'alias': ['lessThan', 'lt'],
      'call': (value: any, contextValue: any, flags: string[]) => {
        if (typeof value === 'number' && typeof contextValue === 'number') {
          return value > contextValue;
        }
        throw(new CheckError({
          'status': false,
          'operator': 'lessThan',
          'given_value': value,
          'contextValue': contextValue,
          'flags': flags,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof contextValue} is not handle`,
        }));
      },
      'humanlyReadableAs': 'less than',
    },

  'lessThanEquals':
    {
      'alias': ['lessequal', 'lte'],
      'call': (value: any, contextValue: any, flags: string[]) => {
        if (typeof value === 'number' && typeof contextValue === 'number') {
          return value >= contextValue;
        }
        throw(new CheckError({
          'status': false,
          'operator': 'lessThanEquals',
          'given_value': value,
          'contextValue': contextValue,
          'flags': flags,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof contextValue} is not handle`,
        }));
      },
      'humanlyReadableAs': 'lesser or equal to',
    },
};
