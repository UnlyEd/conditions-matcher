import StartsWith from './StartsWith';

describe('StartWith operator', () => {
  const operator = new StartsWith();
  test('Output should be true', () => {
    expect(operator.callback('Hel', 'Hello', [])).toBe(true);
    expect(operator.callback('HEL', 'Hello', ['i'])).toBe(true);
  });
  test('Output should throw', () => {
    expect(() => {
      operator.callback(undefined, undefined, []);
    }).toThrowError('CheckError');
  });
});
