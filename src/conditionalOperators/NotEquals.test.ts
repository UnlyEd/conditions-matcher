import NotEquals from './NotEquals';

describe('NotEquals operator', () => {
  const operator = new NotEquals();
  test('Output should be true', () => {
    expect(operator.callback('HELLO WORLD', 'hello world', [])).toBe(true);
    expect(operator.callback('42', 42, [])).toBe(true);
  });
  test('Output should be false', () => {
    expect(operator.callback(null, null, [])).toBe(false);
    expect(operator.callback({ 'hello': 'world', 'obj': {} }, { 'hello': 'world', 'obj': {} }, [])).toBe(false);
    expect(operator.callback(['foo', 'bar'], ['foo', 'bar'], [])).toBe(false);
    expect(operator.callback('Hello', 'Hello', [])).toBe(false);
    expect(operator.callback('HELLO WORLD', 'hello world', ['i'])).toBe(false);
  });
});
