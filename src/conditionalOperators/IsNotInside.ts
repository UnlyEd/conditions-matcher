import { CheckError } from '../utils/errors';
import ConditionalOperator from './ConditionalOperator';
import { isStringInArray, isObjectInObject, isStringInObject, isStringInString } from './utils';

class IsNotInside extends ConditionalOperator {
  alias: string[] = ['isNotInside', 'isnIn'];
  humanlyReadableAs: string = 'not inside';

  callback(value: any, contextValue: any, flags: string[] = []): boolean {
    let ret = isStringInString(value, contextValue, flags);

    if (ret === null) {
      ret = isStringInArray(value, contextValue, flags);
    }
    if (ret === null) {
      ret = isStringInObject(value, contextValue, flags);
    }
    if (ret === null) {
      ret = isObjectInObject(value, contextValue, flags);
    }
    if (ret === null) {
      throw new CheckError({
        'status': false,
        'conditionalOperator': 'includes',
        'value': value,
        'contextValue': contextValue,
        'flags': flags,
        'reason': `Error: The operator includes does not handle the types "${typeof contextValue}" and "${typeof value}"`,
      });
    }
    return !ret;
  }
}

export default IsNotInside;
