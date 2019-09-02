import None from './None';

describe('None operator', () => {
  const operator = new None();
  test('Output should be true', () => {
    expect(operator.callback([false, false])).toBe(true);
  });
  test('Output should be false', () => {
    expect(operator.callback([true, false])).toBe(false);
    expect(operator.callback([true, true])).toBe(false);
  });
});
