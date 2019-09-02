import { isString, startsWith } from 'lodash';
import { CheckError } from '../utils/errors';
import ConditionalOperator from './ConditionalOperator';

class StartsWith extends ConditionalOperator {
  alias: string[] = ['startsWith', 'sw'];
  humanlyReadableAs: string = 'starts with';

  callback(value: any, contextValue: any, flags: string[]): boolean {
    if (isString(value) && isString(contextValue)) {
      if (flags.includes('i')) {
        return startsWith(contextValue.toLowerCase(), value.toLowerCase());
      }
      return startsWith(contextValue, value);
    }
    throw new CheckError({
      'status': false,
      'conditionalOperator': this.alias[0],
      'value': value,
      'contextValue': contextValue,
      'flags': flags,
      'reason': `The operator "${this.alias[0]}" does not handle the types "${typeof contextValue}" and "${typeof value}"`,
    });
  }
}

export default StartsWith;
