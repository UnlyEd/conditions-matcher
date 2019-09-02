import { and, not, or } from './logicalOperators';

describe('logicalOperators', () => {
  describe('AND operator', () => {
    test('Values are true', () => {
      expect(and([true, true, true, true])).toEqual(true);
      expect(and([true])).toEqual(true);
    });
    test('Values are mixed', () => {
      expect(and([true, false, true])).toEqual(false);
      expect(and([true, false, false])).toEqual(false);
      expect(and([true, false])).toEqual(false);
    });
    test('Values are false', () => {
      expect(and([false, false])).toEqual(false);
      expect(and([false])).toEqual(false);
    });
  });

  describe('OR operator', () => {
    test('Values are true', () => {
      expect(or([true, true, true, true])).toEqual(true);
      expect(or([true])).toEqual(true);
    });
    test('Values are mixed', () => {
      expect(or([true, false, true])).toEqual(true);
      expect(or([true, false, false])).toEqual(true);
      expect(or([true, false])).toEqual(true);
    });
    test('Values are false', () => {
      expect(or([false, false])).toEqual(false);
      expect(or([false])).toEqual(false);

    });
  });

  describe('NOT operator', () => {
    test('Values are true', () => {
      expect(not([true, true, true, true])).toEqual(false);
      expect(not([true])).toEqual(false);
    });
    test('Values are mixed', () => {
      expect(not([true, false, true])).toEqual(false);
      expect(not([true, false, false])).toEqual(false);
      expect(not([false, true])).toEqual(false);
    });
    test('Values are false', () => {
      expect(not([false, false])).toEqual(true);
      expect(not([false])).toEqual(true);
    });
  });
});
