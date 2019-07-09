import { deepEqual } from 'assert';

import { CheckError } from './errors';
import { IFilter } from "./conditions";

export const SEP_OPERATOR = '__';
export const SEP_FLAG = '_';
export const SEP_PATH = '_';
export const DEFAULT_CONDITION = 'equals';
export const GET_SEPARATOR = '.';
export const EVERY_STRING = 'every';
export const SOME_STRING = 'some';
export const NONE_STRING = 'none';

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
    'call': (value: any, expected: any, flag: string[]) => {
      if (typeof value === 'string' && typeof expected === 'string') {
        if (flag.includes('i')) {
          const tmp = expected.toLowerCase();
          return tmp.startsWith(value.toLowerCase());
        }
        return expected.startsWith(value);
      }
      return false;
    },
    'humanlyReadableAs': 'starts with',
  },

  'endsWith': {
    'alias': ['endsWith', 'ew'],
    'call': (value: any, expected: any, flag: string[]) => {
      if (typeof value === 'string' && typeof expected === 'string') {
        if (flag.includes('i')) {
          const tmp = expected.toLowerCase();
          return tmp.endsWith(value.toLowerCase());
        }
        return expected.endsWith(value);
      }
      return false;
    },
    'humanlyReadableAs': 'ends with',
  },

  'equals':
    {
      'alias': ['equals', 'eq'],
      'call': (value: any, expected: any, flag: string[]) => {
        if (typeof value === typeof expected) {
          if (typeof value === 'object' || typeof expected === 'object') {
            try {
              deepEqual(value, expected);
              return true;
            } catch (e) {
              console.log(e);
              return false;
            }
          }
          if (flag.includes('i')) {
            return value.toLowerCase() === expected.toLowerCase();
          }
          return value === expected;
        }
        return false;
      },
      'humanlyReadableAs': 'equal',
    },
  'notEquals':
    {
      'alias': ['ne', 'notEquals'],
      'call': (value: any, expected: any, flag: string[]) => {
        if (typeof value === 'object' || typeof expected === 'object') {
          try {
            deepEqual(value, expected);
            return false;

          } catch (_) {
            return true;
          }
        }
        if (flag.includes('i')) {
          return value.toLowerCase() !== expected.toLowerCase();
        }
        return value !== expected;
      },
      'humanlyReadableAs': 'not',
    },

  'contains':
    {
      'alias': ['contains', 'includes', 'in'],
      'call': (value: any, expected: any, flag: string[]) => {
        if (typeof value === 'object' && typeof expected === 'object') {
          for (const el in value) {
            if (expected.hasOwnProperty(el) && (expected[el] !== value[el])) {
              return false;
            }
          }
          return true;
        }
        if (typeof value === 'string' && typeof expected === 'string') {
          if (flag.includes('i')) {
            return expected.toLowerCase().search(value.toLowerCase()) >= 0;
          }
          return expected.search(value) >= 0;
        }
        if (flag.includes('i')) {
          return value.filter((el: string) => el.toLowerCase()).includes(expected.toLowerCase());
        }
        return value.includes(expected);
      },
      'humanlyReadableAs': 'in',
    },

  'notContains':
    {
      'alias': ['notContains', 'not_includes', 'nin'],
      'call': (value: any, expected: any, flag: string[]) => {
        if (typeof value === 'string' && typeof expected === 'string') {
          if (flag.includes('i')) {
            return expected.toLowerCase().search(value.toLowerCase()) === -1;
          }
          return expected.search(value) === -1;
        }
        if (flag.includes('i')) {
          return !value.filter((el: string) => el.toLowerCase()).includes(expected.toLowerCase());
        }
        return !value.includes(expected);
      },
      'humanlyReadableAs': 'not in',
    },

  'greaterThan':
    {
      'alias': ['greaterThan', 'gt'],
      'call': (value: any, expected: any, flag: string[]) => {
        if (typeof value === 'number' && typeof expected === 'number') {
          return value < expected;
        }
        throw(new CheckError({
          'status': false,
          'operator': 'greaterThan',
          'given_value': value,
          'expected': expected,
          'flag': flag,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof expected} is not handle`,
        }));
      },
      'humanlyReadableAs': 'greaterThan than',
    },

  'greaterThanEquals':
    {
      'alias': ['greaterThanEquals', 'gte'],
      'call': (value: any, expected: any, flag: string[]) => {
        if (typeof value === 'number' && typeof expected === 'number') {
          return value <= expected;
        }
        throw(new CheckError({
          'status': false,
          'operator': 'greaterThanEquals',
          'given_value': value,
          'expected': expected,
          'flag': flag,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof expected} is not handle`,
        }));
      },
      'humanlyReadableAs': 'greater or equal than',
    },

  'lessThan':
    {
      'alias': ['lessThan', 'lt'],
      'call': (value: any, expected: any, flag: string[]) => {
        if (typeof value === 'number' && typeof expected === 'number') {
          return value > expected;
        }
        throw(new CheckError({
          'status': false,
          'operator': 'lessThan',
          'given_value': value,
          'expected': expected,
          'flag': flag,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof expected} is not handle`,
        }));
      },
      'humanlyReadableAs': 'less than',
    },

  'lessThanEquals':
    {
      'alias': ['lessequal', 'lte'],
      'call': (value: any, expected: any, flag: string[]) => {
        if (typeof value === 'number' && typeof expected === 'number') {
          return value >= expected;
        }
        throw(new CheckError({
          'status': false,
          'operator': 'lessThanEquals',
          'given_value': value,
          'expected': expected,
          'flag': flag,
          'reason': `Error: wrong type: compare ${typeof value} to  ${typeof expected} is not handle`,
        }));
      },
      'humanlyReadableAs': 'lesser or equal to',
    },
};
