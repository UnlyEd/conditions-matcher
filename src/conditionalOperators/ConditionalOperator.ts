import IConditionalOperator from '../interfaces/IConditionalOperator';

class ConditionalOperator implements IConditionalOperator {
  alias: string[] = [];
  humanlyReadableAs: string = '';

  constructor() {
    // Force bind callback to the current class, to avoid "this" being undefined within the "callback" method
    this.callback = this.callback.bind(this);
  }

  /**
   * This function is a callback used by all conditional operators.
   *
   * @param value
   * @param contextValue
   * @param flags
   */
  callback(value: any, contextValue?: any, flags?: string[]): boolean {
    throw Error(`"callback" must be implemented in child class. ConditionalOperator cannot be used directly.`);
  };
}

export default ConditionalOperator;
