import LessThanEquals from './LessThanEquals';

describe('LessThanEqual operator', () => {
  const operator = new LessThanEquals();
  test('Output should be true', () => {
    expect(operator.callback(42, 24)).toBe(true);
    expect(operator.callback('42', '24')).toBe(true);
    expect(operator.callback('hello', 'hello')).toBe(true);
  });
});
