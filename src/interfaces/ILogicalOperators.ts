/**
 * Interface that will contain the call back of the logical Operator like AND, OR, NOT
 */
import ILogicalOperator from './ILogicalOperator';

export default interface ILogicalOperators {
  [key: string]: ILogicalOperator
}
