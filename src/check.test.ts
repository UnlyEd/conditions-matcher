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
  describe('test of empty or inexistent value in context or filter', () => {
    test('inexistent value', async () => {
      try {
        check(context, 'school_empty__eq', 'empty');
      } catch (e) {
        expect(e.name).toBe('ValueNotFound');
      }
    });
  });
  describe('error test', () => {
    test(`operator doesn't exist`, async () => {
      try {
        check(context, 'school_name__notAnOperator', 'EPITECH');
      } catch (e) {
        expect(e.data.status).toBe(false);
        expect(e.data.reason).toBe(`Error: operator: "notAnOperator" does not exist or doesn't have "call" attribute`);
      }
    });
  });
  describe('simple test', () => {
    test(`should match it's a simple test without operator`, async () => {
      expect(check(context, 'school_name', 'EPITECH').status).toBe(true);
    });
  });

  describe('startsWith test', () => {
    test(`startsWith operator`, async () => {
      expect(check(context, 'school_name__startsWith', 'EPI').status).toBe(true);
    });
    test(`startsWith operator should be false`, async () => {
      expect(check(context, 'school_name__startsWith', 'unly').status).toBe(false);
    });
    test(`startsWith operator with i flag`, async () => {
      expect(check(context, 'school_name__startsWith_i', 'epi').status).toBe(true);
    });
  });

  describe('endsWith test', () => {
    test(`endsWith operator`, async () => {
      expect(check(context, 'school_name__endsWith', 'TECH').status).toBe(true);
    });
    test(`endsWith operator should not match`, async () => {
      expect(check(context, 'school_name__endsWith', 'unly').status).toBe(false);
    });
    test(`endsWith operator with i flag`, async () => {
      expect(check(context, 'school_name__endsWith_i', 'tech').status).toBe(true);
    });
  });

  describe('equal test', () => {
    test(`equal test with string === string`, async () => {
      expect(check(context, 'school_name__eq', 'EPITECH').status).toBe(true);
    });
    test(`equal test with array === array`, async () => {
      const tmp = check(context, 'list__eq', [42, 24]);
      console.log(tmp)

      expect(tmp.status).toBe(true);
    });
    test(`equal test with number === string`, async () => {
      expect(check(context, 'school_averageGPA__eq', '2.5').status).toBe(false);
    });
    test(`equal test with object === object`, async () => {
      expect(check(context, 'school_address__eq', {
        'street': 'Baker Street',
        'city': 'London',
        'number': '221B',
      }).status).toBe(true);
    });
    test(`equal test with string === string and flag i`, async () => {
      expect(check(context, 'school_name__eq_i', 'epitech').status).toBe(true);
    });
  });

  describe('not test', () => {
    test(`not operator`, async () => {
      expect(check(context, 'school_name__ne', 'UNLY').status).toBe(true);
    });
    test(`not operator with i flag`, async () => {
      expect(check(context, 'school_name__ne_i', 'epitech').status).toBe(false);
    });
  });

  describe('contains test', () => {
    test(`contains operator`, async () => {
      expect(check(context, 'school_name__in', ['STUDYLINK', 'UNLY']).status).toBe(false);
    });
    test(`contains operator with string`, async () => {
      expect(check(context, 'school_name__in', 'TECH').status).toBe(true);
    });
    test(`contains operator with i flag with string`, async () => {
      expect(check(context, 'school_name__in_i', 'tech').status).toBe(true);
    });
    test(`contains operator with i flag`, async () => {
      expect(check(context, 'school_name__in_i', ['UNLY', 'epitech']).status).toBe(true);
    });
    test(`contains operator with bool`, async () => {
      expect(check(context, 'school_isOpen__in', [true, 'epitech']).status).toBe(true);
    });
    test(`contains operator with number`, async () => {
      expect(check(context, 'school_averageGPA__in', [true, 2.5]).status).toBe(true);
    });
    test(`contain operator with object`, async () => {
      expect(check(context, 'school__contains', { 'street': 'Baker Street' }).status).toBe(true);
    });
  });

  describe('not contains test', () => {
    test(`not contains test`, async () => {
      expect(check(context, 'school_name__nin', ['EPITECH', 'UNLY']).status).toBe(false);
    });
    test(`not contains test should be false`, async () => {
      expect(check(context, 'school_name__nin', ['STUDYLINK', 'UNLY']).status).toBe(true);
    });
  });

  describe('less than test', () => {
    test(`less than operator`, async () => {
      expect(check(context, 'school_averageGPA__lt', 5).status).toBe(true);
    });
    test(`less or equal than operator`, async () => {
      expect(check(context, 'school_averageGPA__lte', 5).status).toBe(true);
    });
    test(`less operator should be false`, async () => {
      expect(check(context, 'school_averageGPA__lt', 1).status).toBe(false);
    });
  });

  describe('greater than test', () => {
    test(`greater than operator`, async () => {
      expect(check(context, 'school_averageGPA__gt', 1).status).toBe(true);
    });
    test(`greater or equal operator `, async () => {
      expect(check(context, 'school_averageGPA__gte', 1).status).toBe(true);
    });
    test(`greater or equal operator with equal`, async () => {
      expect(check(context, 'school_averageGPA__gte', 2.5).status).toBe(true);
    });
    test(`greater or equal should be false`, async () => {
      expect(check(context, 'school_averageGPA__gt', 5).status).toBe(false);
    });
  });

  describe('every some non test', () => {
    test(`every test`, async () => {
      expect(check(context, 'partner_number__every_eq', 42).status).toBe(true);
    });
    test(`some test`, async () => {
      expect(check(context, 'partner_name__some_eq', 'banque').status).toBe(true);
    });
    test(`none test`, async () => {
      expect(check(context, 'partner_name__none_eq', 'fake_name').status).toBe(true);
    });
    // Check with unexpected input (not array)
    test(`none test`, async () => {
      expect(check(context, 'school_name__every_eq', 'fake_name').status).toBe(false);
    });
    test(`none test`, async () => {
      expect(check(context, 'school_name__none_eq', 'fake_name').status).toBe(true);
    });
  });
});
