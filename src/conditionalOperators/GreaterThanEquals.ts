import ConditionalOperator from './ConditionalOperator';

class GreaterThanEquals extends ConditionalOperator {
  alias: string[] = ['greaterThanEquals', 'gte'];
  humanlyReadableAs: string = 'greater or equal than';

  callback(value: string | number, contextValue: string | number, flags?: string[]): boolean {
    return contextValue >= value;
  }
}

export default GreaterThanEquals;
