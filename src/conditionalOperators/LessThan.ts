import ConditionalOperator from './ConditionalOperator';

class LessThan extends ConditionalOperator {
  alias: string[] = ['lessThan', 'lt'];
  humanlyReadableAs: string = 'less than';

  callback(value: string | number, contextValue: string | number, flags?: string[]): boolean {
    return contextValue < value;
  }
}

export default LessThan;
