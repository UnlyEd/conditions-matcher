import IsNotInside from './IsNotInside';

describe('NotIsInside operator', () => {
  const operator = new IsNotInside();
  test('Output should be true', () => {
    expect(operator.callback('foo', 'Hello World',)).toBe(true);
  });

  test('Output should throw', () => {
    expect(() => {
      operator.callback(undefined, undefined);
    }).toThrowError(/CheckError/);
  });

  test('Output should be false', () => {

    expect(operator.callback('Hello', 'Hello World',)).toBe(false);
    expect(operator.callback(['Hello', 'World'], 'Hello')).toBe(false);
    expect(operator.callback({ 'Hello': 'World' }, 'Hello')).toBe(false);
  });
});
