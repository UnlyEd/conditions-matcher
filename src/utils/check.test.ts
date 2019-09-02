import { check } from './check';

const context = {
  'school': {
    'name': 'EPITECH',
    'averageGPA': 2.5,
    'averageGPAString': '2.5',
    'address': {
      'street': 'Baker Street',
      'number': '221B',
      'city': 'London',
    },
    'isOpen': true,
  },
  'list': [42, 24],
  'partner': [
    {
      name: 'banque',
      number: 42,
    },
    {
      name: 'UNLY',
      name__flags: [],
      number: 42,
    },
    {
      name: 'studylink',
      number: 42,
    },
  ],
};

describe('utils/check', () => {
  describe('when the given value does not exist in the context, then it', () => {
    test('should not find a match', async () => {
      const result = check(context, 'partner_name__some_eq', 'UNLy');
      expect(result.status).toEqual(false);
    });
  });

  describe('when the given rule key does not exist in the context, then it', () => {
    test('should throw a "ValueNotFound" exception, which includes proper "data"', async () => {
      try {
        check(context, 'school_empty__eq', 'empty');
      } catch (e) {
        expect(e.name).toEqual('ValueNotFound');
        expect(e.data.status).toBeNull();
        expect(e.data.expected).toBeUndefined();
      }
    });
  });

  describe('error test', () => {
    test(`operator doesn't exist`, async () => {
      try {
        check(context, 'school_name__notAnOperator', 'EPITECH');
      } catch (e) {
        expect(e.data.status).toEqual(false);
        expect(e.data.reason).toEqual(`Error: operator: "notAnOperator" does not exist or doesn't have "callback" attribute`);
      }
    });
  });

  describe('simple test', () => {
    test(`should match it's a simple test without operator`, async () => {
      expect(check(context, 'school_name', 'EPITECH').status).toEqual(true);
    });
  });

  describe('complex operators', () => {
    describe('every operator', () => {
      test(`on standard usage`, async () => {
        expect(check(context, 'partner_number__every_eq', 42).status).toEqual(true);
      });
      test(`with default value`, async () => {
        expect(check(context, 'partner_number__every', 42).status).toEqual(true);
      });
      test(`with empty context`, async () => {
        expect(() => {
          check({}, 'partner_number__every', 42);
        }).toThrowError(/ValueNotFound/);
      });
      test(`with empty context and strict match mode on`, async () => {
        expect(check({}, 'partner_number__every', 42, { 'strictMatch': true }).status).toBeFalsy();
      });
    });

    describe('some operator', () => {
      test(`on standard usage`, async () => {
        expect(check(context, 'partner_name__some_eq', 'banque').status).toEqual(true);
      });
    });

    describe('non operator', () => {
      test(`on standard usage`, async () => {
        expect(check(context, 'partner_name__none_eq', 'fake_name').status).toEqual(true);
        expect(check(context, 'school_name__none_eq', 'fake_name').status).toEqual(true);
      });
    });

  });
});
