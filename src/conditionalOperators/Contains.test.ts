import Contains from './Contains';

describe('Contains operator', () => {
  const operator = new Contains();
  test('Output should be true', () => {
    expect(operator.callback('Hello World', 'Hello',)).toBe(true);
    expect(operator.callback('Hello', ['Hello', 'World'])).toBe(true);
    expect(operator.callback('HELLO', ['Hello', 'World'], ['i'])).toBe(true);
    expect(operator.callback('Hello', { 'Hello': 'World' })).toBe(true);
  });
  test('Output should throw', () => {
    expect(() => {
      operator.callback(undefined, undefined);
    }).toThrowError(/CheckError/);
  });
});
