import { CheckError } from '../utils/errors';
import ConditionalOperator from './ConditionalOperator';
import { handleArrayInCOPContain, handleObjectInObjectInCOPContain, handleStringInObjectInCOPContain, handleStringInStringInCOPContain } from './utils';

class NotContains extends ConditionalOperator {
  alias: string[] = ['notContains', 'notIncludes', 'nin'];
  humanlyReadableAs: string = 'not in';

  callback(value: any, contextValue: any, flags: string[]): boolean {
    let ret = handleStringInStringInCOPContain(value, contextValue, flags);

    if (ret === null) {
      ret = handleArrayInCOPContain(value, contextValue, flags);
    }
    if (ret === null) {
      ret = handleStringInObjectInCOPContain(value, contextValue, flags);
    }
    if (ret === null) {
      ret = handleObjectInObjectInCOPContain(value, contextValue, flags);
    }

    // XXX If no return value was resolved, it means the provided types aren't handled
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
    return !ret;
  }
}

export default NotContains;
