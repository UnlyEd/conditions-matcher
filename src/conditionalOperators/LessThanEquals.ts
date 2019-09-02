import ConditionalOperator from './ConditionalOperator';

class LessThanEquals extends ConditionalOperator {
  alias: string[] = ['lessThanEquals', 'lte'];
  humanlyReadableAs: string = 'lesser or equal to';

  callback(value: string | number, contextValue: string | number, flags?: string[]): boolean {
    return contextValue <= value;
  }
}

export default LessThanEquals;
