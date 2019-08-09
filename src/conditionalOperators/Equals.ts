import { isEqual, isEqualWith } from 'lodash';
import ConditionalOperator from './ConditionalOperator';
import { checkStringEqualNoMatchCase } from './utils';

class Equals extends ConditionalOperator {
  alias: string[] = ['equals', 'eq'];
  humanlyReadableAs: string = 'equal';

  callback(value: any, contextValue: any, flags: string[]): boolean {
    if (flags.includes('i')) {
      return isEqualWith(value, contextValue, checkStringEqualNoMatchCase);
    } else {
      return isEqual(value, contextValue);
    }
  }
}

export default Equals;
