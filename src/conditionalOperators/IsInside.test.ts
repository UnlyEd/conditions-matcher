import IsInside from './IsInside';

describe('isInside operator', () => {
  const operator = new IsInside();
  test('Output should be true', () => {
    expect(operator.callback('Hello', 'Hello World',)).toBe(true);
    expect(operator.callback('hello', 'Hello World', ['i'])).toBe(true);
    expect(operator.callback(['Hello', 'World'], 'Hello')).toBe(true);
    expect(operator.callback({ 'Hello': 'World' }, 'Hello')).toBe(true);
    expect(operator.callback({ 'foo': { 'Hello': 'World' } }, { 'Hello': 'World' })).toBe(true);
    expect(operator.callback({ 'foo': { 'bar': { 'Hello': 'World' } } }, { 'Hello': 'World' })).toBe(true);
  });

  test('Output should throw', () => {
    expect(() => {
      operator.callback(undefined, undefined);
    }).toThrowError(/CheckError/);
  });

  test('Output should be false', () => {
    expect(operator.callback({ 'foo': { 'foo': 'foo' } }, { 'Hello': 'World' })).toBe(false);
  });
});
