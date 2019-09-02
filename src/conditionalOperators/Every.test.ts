import Every from './Every';

describe('Every operator', () => {
  const operator = new Every();
  test('Output should be true', () => {
    expect(operator.callback([true, true])).toBe(true);
  });
  test('Output should be false', () => {
    expect(operator.callback([true, false])).toBe(false);
  });
});
