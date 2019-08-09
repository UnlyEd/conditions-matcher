import ILogicalOperator from '../interfaces/ILogicalOperator';
import ILogicalOperators from '../interfaces/ILogicalOperators';

export const LOP_AND = 'AND';
export const LOP_OR = 'OR';
export const LOP_NOT = 'NOT';

export const and: ILogicalOperator = (values: boolean[]) => {
  return values.filter(returnValue => !returnValue).length === 0;
};

export const or: ILogicalOperator = (values: boolean[]) => {
  return values.filter(returnValue => returnValue).length > 0;
};

export const not: ILogicalOperator = (values: boolean[]) => {
  return values.filter(returnValue => returnValue).length === 0;
};

/**
 * Global object containing all logical operators handled
 */
export const logicalOperators: ILogicalOperators = {
  [LOP_AND]: and,
  [LOP_OR]: or,
  [LOP_NOT]: not,
};
