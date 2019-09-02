import { or } from '../operators/logicalOperators';
import ConditionalOperator from './ConditionalOperator';

class Some extends ConditionalOperator {
  alias: string[] = ['some'];
  humanlyReadableAs: string = 'some';

  callback(value: boolean[]): boolean {
    return or(value);
  }
}

export default Some;
