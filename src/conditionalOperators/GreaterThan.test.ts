import GreaterThan from './GreaterThan';

describe('GreaterThan operator', () => {
  const operator = new GreaterThan();
  test('Output should be true', () => {
    expect(operator.callback(24, 42)).toBe(true);
    expect(operator.callback('24', '42')).toBe(true);
  });
  test('Output should be false', () => {
    expect(operator.callback('hello', 'hello')).toBe(false);
  });
});
