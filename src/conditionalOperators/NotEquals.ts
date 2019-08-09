import { isEqual, isEqualWith } from 'lodash';
import ConditionalOperator from './ConditionalOperator';
import { checkStringEqualNoMatchCase } from './utils';

class NotEquals extends ConditionalOperator {
  alias: string[] = ['ne', 'notEquals'];
  humanlyReadableAs: string = 'not';

  callback(value: any, contextValue: any, flags: string[]): boolean {
    if (flags.includes('i')) {
      return !isEqualWith(value, contextValue, checkStringEqualNoMatchCase);
    } else {
      return !isEqual(value, contextValue);
    }
  }
}

export default NotEquals;

