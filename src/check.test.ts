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
      expect(result.status).toEqual(false)
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
        expect(e.data.reason).toEqual(`Error: operator: "notAnOperator" does not exist or doesn't have "call" attribute`);
      }
    });
  });

  describe('simple test', () => {
    test(`should match it's a simple test without operator`, async () => {
      expect(check(context, 'school_name', 'EPITECH').status).toEqual(true);
    });
  });

  describe('startsWith test', () => {
    test(`startsWith operator`, async () => {
      expect(check(context, 'school_name__startsWith', 'EPI').status).toEqual(true);
    });
    test(`startsWith operator should be false`, async () => {
      expect(check(context, 'school_name__startsWith', 'unly').status).toEqual(false);
    });
  });

  describe('endsWith test', () => {
    test(`endsWith operator`, async () => {
      expect(check(context, 'school_name__endsWith', 'TECH').status).toEqual(true);
    });
    test(`endsWith operator should not match`, async () => {
      expect(check(context, 'school_name__endsWith', 'unly').status).toEqual(false);
    });
  });

  describe('equal test', () => {
    test(`equal test with string === string`, async () => {
      expect(check(context, 'school_name__eq', 'EPITECH').status).toEqual(true);
    });
    test(`equal test with array === array`, async () => {
      const tmp = check(context, 'list__eq', [42, 24]);
      expect(tmp.status).toEqual(true);
    });
    test(`equal test with number === string`, async () => {
      expect(check(context, 'school_averageGPA__eq', '2.5').status).toEqual(false);
    });
    test(`equal test with object === object`, async () => {
      expect(check(context, 'school_address__eq', {
        'street': 'Baker Street',
        'city': 'London',
        'number': '221B',
      }).status).toEqual(true);
    });
  });

  describe('not test', () => {
    test(`not operator`, async () => {
      expect(check(context, 'school_name__ne', 'UNLY').status).toEqual(true);
    });
  });

  describe('contains test', () => {
    test(`contains operator`, async () => {
      expect(check(context, 'school_name__in', ['STUDYLINK', 'UNLY']).status).toEqual(false);
    });
    test(`contains operator with string`, async () => {
      expect(check(context, 'school_name__in', 'TECH').status).toEqual(true);
    });
    test(`contains operator with bool`, async () => {
      expect(check(context, 'school_isOpen__in', [true, 'epitech']).status).toEqual(true);
    });
    test(`contains operator with number`, async () => {
      expect(check(context, 'school_averageGPA__in', [true, 2.5]).status).toEqual(true);
    });
    test(`contain operator with object`, async () => {
      expect(check(context, 'school__contains', { 'street': 'Baker Street' }).status).toEqual(true);
    });
  });

  describe('not contains test', () => {
    test(`not contains test`, async () => {
      expect(check(context, 'school_name__nin', ['EPITECH', 'UNLY']).status).toEqual(false);
    });
    test(`not contains test should be false`, async () => {
      expect(check(context, 'school_name__nin', ['STUDYLINK', 'UNLY']).status).toEqual(true);
    });
  });

  describe('less than test', () => {
    test(`less than operator`, async () => {
      expect(check(context, 'school_averageGPA__lt', 5).status).toEqual(true);
    });
    test(`less or equal than operator`, async () => {
      expect(check(context, 'school_averageGPA__lte', 5).status).toEqual(true);
    });
    test(`less operator should be false`, async () => {
      expect(check(context, 'school_averageGPA__lt', 1).status).toEqual(false);
    });
  });

  describe('greater than test', () => {
    test(`greater than operator`, async () => {
      expect(check(context, 'school_averageGPA__gt', 1).status).toEqual(true);
    });
    test(`greater or equal operator `, async () => {
      expect(check(context, 'school_averageGPA__gte', 1).status).toEqual(true);
    });
    test(`greater or equal operator with equal`, async () => {
      expect(check(context, 'school_averageGPA__gte', 2.5).status).toEqual(true);
    });
    test(`greater or equal should be false`, async () => {
      expect(check(context, 'school_averageGPA__gt', 5).status).toEqual(false);
    });
  });

  describe('every some non test', () => {
    test(`every test`, async () => {
      expect(check(context, 'partner_number__every_eq', 42).status).toEqual(true);
    });
    test(`some test`, async () => {
      expect(check(context, 'partner_name__some_eq', 'banque').status).toEqual(true);
    });
    test(`none test`, async () => {
      expect(check(context, 'partner_name__none_eq', 'fake_name').status).toEqual(true);
    });
    // Check with unexpected input (not array)
    test(`none test`, async () => {
      expect(check(context, 'school_name__every_eq', 'fake_name').status).toEqual(false);
    });
    test(`none test`, async () => {
      expect(check(context, 'school_name__none_eq', 'fake_name').status).toEqual(true);
    });
  });

  describe('test flags', () => {
    const context = {
      'school': {
        'name': 'EPITECH',
        'name__flags': ["i"],
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
          name__flag: ['i'],
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
    test('equal i flag', async () => {
      expect(check(context, "school_name__eq", "epitech").status).toEqual(true)
    });
    test('startsWith i flag', async () => {
      expect(check(context, "school_name__sw", "epi").status).toEqual(true)
    });
    test('endsWith i flag', async () => {
      expect(check(context, "school_name__ew", "tech").status).toEqual(true)
    });
    test('contains i flag', async () => {
      expect(check(context, "school_name__in", ["epitech"]).status).toEqual(true)
    });
    test('nocontains i flag', async () => {
      expect(check(context, "school_name__nin", ["epitech"]).status).toEqual(false)
    });
  })
});
