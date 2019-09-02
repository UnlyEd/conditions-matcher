import { get, isArray, isEqual, isObject, isString } from 'lodash';

/**
 * this function check if two string are equal without key sensitivity
 * @param x
 * @param y
 */
export function checkStringEqualNoMatchCase(x: any, y: any): boolean | undefined {
  if (isString(x) && isString(y)) {
    return x.toLowerCase() === y.toLowerCase();
  }
}

/**
 * this function check if a string is inside a other
 * @param value
 * @param contextValue
 * @param flags
 */
export function isStringInString(value: any, contextValue: any, flags: string[]): boolean | null {
  if (isString(value) && isString(contextValue)) {
    if (flags.includes('i')) {
      return contextValue.toLowerCase().includes(value.toLowerCase());
    }
    return contextValue.includes(value);
  }
  return null;
}

/**
 * this function check if an items is inside an array
 * @param value
 * @param contextValue
 * @param flags
 */
export function isStringInArray(value: any, contextValue: any, flags: string[]): boolean | null {
  if (isArray(value)) {
    if (flags.includes('i')) {
      value = value.map((el) => {
        return isString(el) ? el.toLowerCase() : el;
      });
      contextValue = isString(contextValue) ? contextValue.toLowerCase() : contextValue;
    }
    return value.includes(contextValue);
  }
  return null;
}

/**
 * check if a string is inside the keys of an object
 * @param value
 * @param contextValue
 * @param flags
 */
export function isStringInObject(value: any, contextValue: any, flags: string[]): boolean | null {
  if (isObject(value) && isString(contextValue)) {
    return value.hasOwnProperty(contextValue);
  }
  return null;
}

/**
 * check if an object as the same key and value as an other
 * @param value
 * @param contextValue
 * @param flags
 */
export function isObjectInObject(value: any, contextValue: any, flags?: string[]): boolean | null {
  if (isObject(value) && isObject(contextValue)) {
    for (const key in value) {
      if (value.hasOwnProperty(key) && isEqual(get(value, key), contextValue)) {
        return true;
      }
    }
    for (const key in value) {
      if (value.hasOwnProperty(key) && isObjectInObject(get(value, key), contextValue)) {
        return true;
      }
    }
    return false;
  }
  return null;
}
