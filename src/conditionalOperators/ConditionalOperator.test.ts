import ConditionalOperator from './ConditionalOperator';

describe('ConditionalOperator', () => {
  test('"callback" should throw an error when called (not implemented)', () => {
    const operator = new ConditionalOperator();
    expect(() => operator.callback(null)).toThrow();
  });
});
