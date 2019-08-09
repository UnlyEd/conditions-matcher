import { and } from '../operators/logicalOperators';
import ConditionalOperator from './ConditionalOperator';

class Every extends ConditionalOperator {
  alias: string[] = ['every'];
  humanlyReadableAs: string = 'every';

  callback(value: any): boolean {
    return and(value);
  }
}

export default Every;
