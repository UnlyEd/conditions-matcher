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
      number: 42,
    },
    {
      name: 'studylink',
      number: 42,
    },
  ],
};

describe('utils/check', () => {
  describe('error test', () => {
    test(`operator doesn't exist`, async () => {
      try {
        check({ context: context, key: 'school_name__notAnOperator', value: 'EPITECH' });
      } catch (e) {
        expect(e.data.status).toBe(false);
        expect(e.data.reason).toBe(`Error: operator: "notAnOperator" does not exist or doesn't have "call" attribute`);
      }
    });
  });
  describe('simple test', () => {
    test(`should match it's a simple test without operator`, async () => {
      expect(check({ context: context, key: 'school_name', value: 'EPITECH' }).status).toBe(true);
    });
  });

  describe('startsWith test', () => {
    test(`startsWith operator`, async () => {
      expect(check({ context: context, key: 'school_name__startsWith', value: 'EPI' }).status).toBe(true);
    });
    test(`startsWith operator should be false`, async () => {
      expect(check({ context: context, key: 'school_name__startsWith', value: 'unly' }).status).toBe(false);
    });
    test(`startsWith operator with i flag`, async () => {
      expect(check({ context: context, key: 'school_name__startsWith_i', value: 'epi' }).status).toBe(true);
    });
  });

  describe('endsWith test', () => {
    test(`endsWith operator`, async () => {
      expect(check({ context: context, key: 'school_name__endsWith', value: 'TECH' }).status).toBe(true);
    });
    test(`endsWith operator should not match`, async () => {
      expect(check({ context: context, key: 'school_name__endsWith', value: 'unly' }).status).toBe(false);
    });
    test(`endsWith operator with i flag`, async () => {
      expect(check({ context: context, key: 'school_name__endsWith_i', value: 'tech' }).status).toBe(true);
    });
  });

  describe('equal test', () => {
    test(`equal test with string === string`, async () => {
      expect(check({ context: context, key: 'school_name__eq', value: 'EPITECH' }).status).toBe(true);
    });
    test(`equal test with array === array`, async () => {
      expect(check({ context: context, key: 'list__eq', value: [42, 24] }).status).toBe(true);
    });
    test(`equal test with number === string`, async () => {
      expect(check({ context: context, key: 'school_averageGPA__eq', value: '2.5' }).status).toBe(false);
    });
    test(`equal test with object === object`, async () => {
      expect(check({
        context: context, key: 'school_address__eq', value: {
          'street': 'Baker Street',
          'city': 'London',
          'number': '221B',
        }
      }).status).toBe(true);
    });
    test(`equal test with string === string and flag i`, async () => {
      expect(check({ context: context, key: 'school_name__eq_i', value: 'epitech' }).status).toBe(true);
    });
  });

  describe('not test', () => {
    test(`not operator`, async () => {
      expect(check({ context: context, key: 'school_name__ne', value: 'UNLY' }).status).toBe(true);
    });
    test(`not operator with i flag`, async () => {
      expect(check({ context: context, key: 'school_name__ne_i', value: 'epitech' }).status).toBe(false);
    });
  });

  describe('contains test', () => {
    test(`contains operator`, async () => {
      expect(check({ context: context, key: 'school_name__in', value: ['STUDYLINK', 'UNLY'] }).status).toBe(false);
    });
    test(`contains operator with string`, async () => {
      expect(check({ context: context, key: 'school_name__in', value: 'TECH' }).status).toBe(true);
    });
    test(`contains operator with i flag with string`, async () => {
      expect(check({ context: context, key: 'school_name__in_i', value: 'tech' }).status).toBe(true);
    });
    test(`contains operator with i flag`, async () => {
      expect(check({ context: context, key: 'school_name__in_i', value: ['UNLY', 'epitech'] }).status).toBe(true);
    });
    test(`contains operator with bool`, async () => {
      expect(check({ context: context, key: 'school_isOpen__in', value: [true, 'epitech'] }).status).toBe(true);
    });
    test(`contains operator with number`, async () => {
      expect(check({ context: context, key: 'school_averageGPA__in', value: [true, 2.5] }).status).toBe(true);
    });
    test(`contain operator with object`, async () => {
      expect(check({ context: context, key: 'school__contains', value: { 'street': 'Baker Street' } }).status).toBe(true);
    });
  });

  describe('not contains test', () => {
    test(`not contains test`, async () => {
      expect(check({ context: context, key: 'school_name__nin', value: ['EPITECH', 'UNLY'] }).status).toBe(false);
    });
    test(`not contains test should be false`, async () => {
      expect(check({ context: context, key: 'school_name__nin', value: ['STUDYLINK', 'UNLY'] }).status).toBe(true);
    });
  });

  describe('less than test', () => {
    test(`less than operator`, async () => {
      expect(check({ context: context, key: 'school_averageGPA__lt', value: 5 }).status).toBe(true);
    });
    test(`less or equal than operator`, async () => {
      expect(check({ context: context, key: 'school_averageGPA__lte', value: 5 }).status).toBe(true);
    });
    test(`less operator should be false`, async () => {
      expect(check({ context: context, key: 'school_averageGPA__lt', value: 1 }).status).toBe(false);
    });
  });

  describe('greater than test', () => {
    test(`greater than operator`, async () => {
      expect(check({ context: context, key: 'school_averageGPA__gt', value: 1 }).status).toBe(true);
    });
    test(`greater or equal operator `, async () => {
      expect(check({ context: context, key: 'school_averageGPA__gte', value: 1 }).status).toBe(true);
    });
    test(`greater or equal operator with equal`, async () => {
      expect(check({ context: context, key: 'school_averageGPA__gte', value: 2.5 }).status).toBe(true);
    });
    test(`greater or equal should be false`, async () => {
      expect(check({ context: context, key: 'school_averageGPA__gt', value: 5 }).status).toBe(false);
    });
  });

  describe('every some non test', () => {
    test(`every test`, async () => {
      expect(check({ context: context, key: 'partner_number__every_eq', value: 42 }).status).toBe(true);
    });
    test(`some test`, async () => {
      expect(check({ context: context, key: 'partner_name__some_eq', value: 'banque' }).status).toBe(true);
    });
    test(`none test`, async () => {
      expect(check({ context: context, key: 'partner_name__none_eq', value: 'fake_name' }).status).toBe(true);
    });
  });
});
