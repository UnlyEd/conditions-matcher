import IConditionalOperator from '../interfaces/IConditionalOperator';

class ConditionalOperator implements IConditionalOperator {
  alias: string[] = [];
  humanlyReadableAs: string = '';

  /**
   * This function is a callback used by all conditional operators.
   *
   * @param value
   * @param contextValue
   * @param flags
   */
  callback(value: any, contextValue?: any, flags?: string[]): boolean {
    return false;
  };
}

export default ConditionalOperator;
