import { CheckError } from '../utils/errors';
import ConditionalOperator from './ConditionalOperator';
import { handleArrayInCOPContain, handleObjectInObjectInCOPContain, handleStringInObjectInCOPContain, handleStringInStringInCOPContain } from './utils';

class Contains extends ConditionalOperator {
  alias: string[] = ['contains', 'includes', 'in'];
  humanlyReadableAs: string = 'in';

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
