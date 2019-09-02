import { CheckError } from '../utils/errors';
import ConditionalOperator from './ConditionalOperator';
import { isObjectInObject, isStringInArray, isStringInObject, isStringInString } from './utils';

class Contains extends ConditionalOperator {
  alias: string[] = ['contains', 'inside', 'in'];
  humanlyReadableAs: string = 'contain';

  callback(value: any, contextValue: any, flags: string[] = []): boolean {
    let ret = isStringInString(contextValue, value, flags);

    if (ret === null) {
      ret = isStringInArray(contextValue, value, flags);
    }
    if (ret === null) {
      ret = isStringInObject(contextValue, value, flags);
    }
    if (ret === null) {
      ret = isObjectInObject(contextValue, value, flags);
    }
    if (ret === null) {
      throw new CheckError({
        'status': false,
        'conditionalOperator': this.alias[0],
        'value': value,
        'contextValue': contextValue,
        'flags': flags,
        'reason': `Error: The operator "${this.alias[0]}" does not handle the types "${typeof contextValue}" and "${typeof value}"`,
      });
    }
    return ret;
  }
}

export default Contains;
