import Equals from './Equals';

describe('Equals operator', () => {
  const operator = new Equals();
  test('Output should be true', () => {
    expect(operator.callback(null, null, [])).toBe(true);
    expect(operator.callback({ 'hello': 'world', 'obj': {} }, { 'hello': 'world', 'obj': {} }, [])).toBe(true);
    expect(operator.callback(['foo', 'bar'], ['foo', 'bar'], [])).toBe(true);
    expect(operator.callback('Hello', 'Hello', [])).toBe(true);
    expect(operator.callback('HELLO', 'Hello', ['i'])).toBe(true);
  });
  test('Output should be false', () => {
    expect(operator.callback('42', 42, [])).toBe(false);

  });
});
