import LessThan from './LessThan';

describe('LessThan operator', () => {
  const operator = new LessThan();
  test('Output should be true', () => {
    expect(operator.callback(42, 24)).toBe(true);
    expect(operator.callback('42', '24')).toBe(true);
  });
  test('Output should be false', () => {
    expect(operator.callback('hello', 'hello')).toBe(false);
  });
});
