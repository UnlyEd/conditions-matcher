import ConditionalOperator from './ConditionalOperator';

describe('ConditionalOperator test src/conditionalOperators/*', () => {
  test('Conditional operator default function', () => {
    const operator = new ConditionalOperator();
    expect(operator.callback(null)).toBe(false);
  });
});
