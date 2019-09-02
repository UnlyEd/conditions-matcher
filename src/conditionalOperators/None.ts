import { not } from '../operators/logicalOperators';
import ConditionalOperator from './ConditionalOperator';

class None extends ConditionalOperator {
  alias: string[] = ['none'];
  humanlyReadableAs: string = 'none';

  callback(value: boolean[]): boolean {
    return not(value);
  }
}

export default None;
