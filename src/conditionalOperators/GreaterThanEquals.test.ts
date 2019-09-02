import GreaterThanEquals from './GreaterThanEquals';

describe('GreaterThanEquals operator', () => {
  const operator = new GreaterThanEquals();
  test('Output should be true', () => {
    expect(operator.callback(24, 42)).toBe(true);
    expect(operator.callback('24', '42')).toBe(true);
    expect(operator.callback('hello', 'hello')).toBe(true);
  });
});
