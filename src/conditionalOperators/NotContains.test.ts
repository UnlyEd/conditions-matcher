import NotContains from './NotContains';

describe('NotContains operator', () => {
  const operator = new NotContains();
  test('Output should be true', () => {
    expect(operator.callback('Hello World', 'Foo', [])).toBe(true);
  });

  test('Output should throw', ()=>{
    expect(() => {
      operator.callback(undefined, undefined, []);
    }).toThrowError(/CheckError/);
  });

  test('Output should be false', () => {
    expect(operator.callback('Hello World', 'Hello', [])).toBe(false);
    expect(operator.callback('Hello', ['Hello', 'World'], [])).toBe(false);
    expect(operator.callback('Hello', { 'Hello': 'World' }, [])).toBe(false);
  });
});
