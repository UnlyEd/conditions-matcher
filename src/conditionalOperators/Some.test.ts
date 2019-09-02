import Some from './Some';

describe('Some operator', () => {
  const operator = new Some();
  test('Output should be true', () => {
    expect(operator.callback([true, true])).toBe(true);
    expect(operator.callback([true, false])).toBe(true);
  });
  test('Output should be false', () => {
    expect(operator.callback([false, false])).toBe(false);
  });
});
