import { CheckError } from '../utils/errors';
import ConditionalOperator from './ConditionalOperator';
import { isObjectInObject, isStringInArray, isStringInObject, isStringInString } from './utils';

class NotContains extends ConditionalOperator {
  alias: string[] = ['notContains', 'notIncludes', 'nin'];
  humanlyReadableAs: string = 'does not contain';

  callback(value: any, contextValue: any, flags: string[]): boolean {
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

    // XXX If no return value was resolved, it means the provided types aren't handled
    if (ret === null) {
      throw new CheckError({
        'status': false,
        'conditionalOperator': this.alias[0],
        'value': value,
        'contextValue': contextValue,
        'flags': flags,
        'reason': `The operator "${this.alias[0]}" does not handle the types "${typeof contextValue}" and "${typeof value}"`,
      });
    }
    return !ret;
  }
}

export default NotContains;
