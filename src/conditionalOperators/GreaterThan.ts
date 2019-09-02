import ConditionalOperator from './ConditionalOperator';

class GreaterThan extends ConditionalOperator {
  alias: string[] = ['greaterThan', 'gt'];
  humanlyReadableAs: string = 'greaterThan';

  callback(value: string | number, contextValue: string | number, flags?: string[]): boolean {
    return contextValue > value;
  }
}

export default GreaterThan;
