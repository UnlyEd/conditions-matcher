import checkContextMatchesConditions from './checkMatches';

describe('src/conditions', () => {
  describe('checkContextMatchesConditions should', () => {
    describe('when using AND operator alone, without complex nesting (using both expressive AND or assumed AND)', () => {
      test(`should match when correct organisation_name is in context`, async () => {
        const filtersSimple = { // Assumed "AND"
          'organisation_name': 'skema',
        };
        const filtersNestedSimple = {
          'AND': [ // Expressive "AND", means exactly the same as previous and must be treated identically
            {
              'organisation_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
        };
        expect(checkContextMatchesConditions(filtersSimple, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
      });

      test(`should NOT match when incorrect organisation_name is in context`, async () => {
        const filtersSimple = {
          'organisation_name': 'skema',
        };
        const filtersNestedSimple = {
          'AND': [
            {
              'organisation_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'mismatching-name',
          },
        };
        const contextNoisy = {
          organisation: {
            name: 'mismatching-name',
            x: 'unused-property',
          },
          unusedKey: {
            y: 'unused-property',
          },
        };
        expect(checkContextMatchesConditions(filtersSimple, context)).toMatchObject({ 'status': false });
        expect(checkContextMatchesConditions(filtersSimple, contextNoisy)).toMatchObject({ 'status': false });
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': false });
        expect(checkContextMatchesConditions(filtersNestedSimple, contextNoisy)).toMatchObject({ 'status': false });
      });

      test('oui', () => {
        const oui = {
          'OR': [
            {
              'AND': [
                {
                  'organisation_name': 'skema'
                },
                {
                  'campus_name': 'paris-la-defense'
                },
                {
                  'institution_name': 'skema-business-school'
                }
              ]
            },
            {
              'AND': [
                {
                  'organisation_name': 'skema'
                },
                {
                  'campus_name': 'lille'
                },
                {
                  'institution_name': 'skema-business-school'
                }
              ]
            }
          ]
        };
        const ret = checkContextMatchesConditions(oui, {});
        console.dir(ret.ignoredConditions, {depth:null, colors:true});
        expect(ret.ignoredConditions).not.toBe(null);

      });

      test(`should match when correct institution_name is in context`, async () => {
        const filtersSimple = {
          'institution_name': 'skema',
        };
        const filtersNestedSimple = {
          'AND': [
            {
              'institution_name': 'skema',
            },
          ],
        };
        const context = {
          institution: {
            name: 'skema',
          },
        };
        expect(checkContextMatchesConditions(filtersSimple, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
      });

      test(`should match when correct organisation_name and institution_name are in context`, async () => {
        const filtersSimple = {
          'organisation_name': 'skema',
          'institution_name': 'demo',
        };
        const filtersNestedSimple = {
          'AND': [
            {
              'organisation_name': 'skema',
              'institution_name': 'demo',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'demo',
          },
        };
        expect(checkContextMatchesConditions(filtersSimple, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
      });

      test(`should NOT match when correct organisation_name and institution_name are in context`, async () => {
        const filtersSimple = {
          'organisation_name': 'skema',
          'institution_name': 'demo',
        };
        const filtersNestedSimple = {
          'AND': [
            {
              'organisation_name': 'skema',
              'institution_name': 'demo',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'mismatching-name',
          },
          institution: {
            name: 'another-mismatching-name',
          },
        };
        expect(checkContextMatchesConditions(filtersSimple, context)).toMatchObject({ 'status': false });
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': false });
      });

      test(`should match when correct organisation_name and institution_name and campus_name are in context`, async () => {
        const filtersSimple = {
          'organisation_name': 'skema',
          'institution_name': 'skema',
          'campus_name': 'paris',
        };
        const filtersNestedSimple = {
          'AND': [
            {
              'organisation_name': 'skema',
              'institution_name': 'skema',
              'campus_name': 'paris',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'skema',
          },
          campus: {
            name: 'paris',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersSimple, context)).toMatchObject({ 'status': true });
      });

      test(`should NOT match when correct organisation_name and institution_name are in context but campus_name is wrong`, async () => {
        const filtersSimple = {
          'organisation_name': 'skema',
          'institution_name': 'skema',
          'campus_name': 'paris',
        };
        const filtersNestedSimple = {
          'AND': [
            {
              'organisation_name': 'skema',
              'institution_name': 'skema',
              'campus_name': 'paris',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'skema',
          },
          campus: {
            name: 'not-paris',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': false });
        expect(checkContextMatchesConditions(filtersSimple, context)).toMatchObject({ 'status': false });
      });
    });

    describe('when using OR operator alone, without complex nesting', () => {
      test(`should match when correct organisation_name is in context`, async () => {
        const filtersNestedSimple = {
          'OR': [
            {
              'organisation_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'skema',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
      });

      test(`should match when correct organisation_name and institution_name are in context`, async () => {
        const filtersNestedSimple = {
          'OR': [
            {
              'organisation_name': 'skema',
              'institution_name': 'skema',
            },
          ],
        };
        const filtersNestedMultiple = {
          'OR': [
            {
              'organisation_name': 'skema',
            },
            {
              'institution_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'skema',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersNestedMultiple, context)).toMatchObject({ 'status': true });
      });

      test(`should match when correct organisation_name and institution_name nested are in context`, async () => {
        const filtersNestedSimple = {
          'OR': [
            {
              'organisation_name': 'skema',
              'institution_name': 'skema',
              'some_name': 'skema',
            },
          ],
        };
        const filtersNestedMultiple = {
          'OR': [
            {
              'organisation_name': 'skema',
            },
            {
              'institution_name': 'skema',
            },
            {
              'some_name': 'skema',
            },
          ],
        };
        const filtersNestedMultipleMix = {
          'OR': [
            {
              'organisation_name': 'skema',
              'institution_name': 'skema',
            },
            {
              'some_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'skema',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersNestedMultiple, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersNestedMultipleMix, context)).toMatchObject({ 'status': true });
      });
    });

    describe('when using NOT operator alone, without complex nesting', () => {
      test(`should match when organisation_name in context isn't unallowed`, async () => {
        const filtersNestedSimple = {
          'NOT': [
            {
              'organisation_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'not-skema',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
      });

      test(`should NOT match when organisation_name in context is unallowed`, async () => {
        const filtersNestedSimple = {
          'NOT': [
            {
              'organisation_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': false });
      });

      test(`should match when organisation_name and institution_name in context aren't unallowed`, async () => {
        const filtersNestedSimple = {
          'NOT': [
            {
              'organisation_name': 'skema',
              'institution_name': 'demo',
            },
          ],
        };
        const filtersNestedMultiple = {
          'NOT': [
            {
              'organisation_name': 'skema',
            },
            {
              'institution_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'not-skema',
          },
          institution: {
            name: 'not-skema',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersNestedMultiple, context)).toMatchObject({ 'status': true });
      });

      test(`should NOT match when organisation_name and institution_name in context are unallowed`, async () => {
        const filtersNestedSimple = {
          'NOT': [
            {
              'organisation_name': 'skema',
              'institution_name': 'demo',
            },
          ],
        };
        const filtersNestedMultiple = {
          'NOT': [
            {
              'organisation_name': 'skema',
            },
            {
              'institution_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'demo',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': false });
        expect(checkContextMatchesConditions(filtersNestedMultiple, context)).toMatchObject({ 'status': false });
      });

      test(`should NOT match when organisation_name isn't allowed, even if other filters are allowed`, async () => {
        const filtersNestedSimple = { // Assumed NOT AND
          'NOT': [
            {
              'organisation_name': 'skema',
              'institution_name': 'skema',
            },
          ],
        };
        const filtersNestedSimpleExpressiveAND = { // Expressive NOT AND
          'NOT': [
            {
              'AND': [
                {
                  'organisation_name': 'skema',
                  'institution_name': 'skema',
                },
              ],
            },
          ],
        };
        const filtersNestedMultiple = {
          'NOT': [
            {
              'organisation_name': 'skema',
            },
            {
              'institution_name': 'skema',
            },
          ],
        };
        const filtersNestedMultipleMix = {
          'NOT': [
            {
              'organisation_name': 'skema',
              'institution_name': 'skema',
            },
          ],
        };
        const context = {
          organisation: {
            name: 'skema',
          },
          institution: {
            name: 'not-skema',
          },
        };
        expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': false });
        expect(checkContextMatchesConditions(filtersNestedSimpleExpressiveAND, context)).toMatchObject({ 'status': true });
        expect(checkContextMatchesConditions(filtersNestedMultiple, context)).toMatchObject({ 'status': false });
        expect(checkContextMatchesConditions(filtersNestedMultipleMix, context)).toMatchObject({ 'status': false });
      });
    });

    describe('handle edge cases', () => {
      describe('when filters contain empty objects', () => {
        test(`should match when correct organisation_name and institution_name are in context`, async () => {
          const filtersNestedSimple = {
            'OR': [
              {
                'organisation_name': 'skema',
                'institution_name': 'skema',
              },
              {}, // edge case, shouldn't fail because there are no condition
              {
                'some_name': 'skema',
              },
              {}, // edge case, shouldn't fail because there are no condition
            ],
          };
          const context = {
            organisation: {
              name: 'skema',
            },
            institution: {
              name: 'skema',
            },
          };
          expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        });
      });

      describe('on big and hard queries', () => {
        const context = {
          organisation: {
            name: 'skema',
            plateform: {
              type: 'school',
              grade: 'A',
              director: {
                name: 'Victor Granger',
                bg: true,
              },
            },
          },
        };
        test(`should match when correct big request with AND, OR, NOT`, async () => {
          const filtersNestedSimple = {
            'AND': [ // true
              {
                'AND': [ // true
                  {
                    'organisation_name__isIn': ['skema', 'epitech', '42'], // true
                    'OR': [ // true
                      {
                        'NOT': [ // true
                          {
                            'organisation_plateform_type': 'wrong-school', // false
                          },
                        ],
                        'organisation_plateform_grade': 'B', // false
                      },
                    ],
                  },
                ],
                'organisation_plateform_director_bg': true, // true
              },
            ],
          };
          expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        });

        test(`should work with multiple NOT and using _i flag`, async () => {
          const filtersNestedSimple = {
            'AND': [ // true
              {
                'organisation_plateform_director_name__startsWith_i': 'victor', // true
                'NOT': [ // true
                  {
                    'NOT': [
                      { // false
                        'organisation_name__isnIn': ['42', 'epitech', '101'], // true
                      },
                    ],
                  },
                ],
              },
            ],
          };
          expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        });

        test(`should work with multiple AND, OR and NOT`, async () => {
          const filtersNestedSimple = {
            'NOT': [ // true
              {
                'organisation_plateform_director_name__endsWith_i': 'victor', // false
                'AND': [ // false
                  {
                    'NOT': [
                      { // false
                        'organisation_name__isnIn': ['42', 'epitech', '101'], // true
                        'organisation_plateform_type__ne': 'school', // false
                      },
                    ],
                    'organisation_plateform_grade__isnIn': ['A', 'B', 'C'], // false
                  },
                ],
              },
            ],
          };
          expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        });

        test(`should work with multiple AND, OR and NOT to false`, async () => {
          const filtersNestedSimple = {
            'NOT': [ // false
              {
                'organisation_plateform_director_name__endsWith_i': 'victor', // false
                'AND': [// true
                  {
                    'NOT': [
                      {// true
                        'organisation_name__isnIn': ['skema', '42', 'epitech', '101'], // false
                        'organisation_plateform_type__ne': 'school', // false
                      },
                    ],
                    'organisation_plateform_grade__isIn': ['A', 'B', 'C'], // true
                  },
                ],
              },
            ],
          };
          expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': false });
        });
      });

      describe('check debug object', () => {
        const context = {
          organisation: {
            name: 'skema',
            user: {
              name: 'Hugo',
              age: '21',
            },
            plateform: {
              type: 'school',
              grade: 'A',
              director: {
                'name': 'Victor Granger',
              },
            },
          },
        };

        test(`bad op`, async () => {
          const filtersNestedSimple = {
            'AND': [ // true
              {
                'organisation_name__startsWith': 'sk', // true
                'organisation_name__wrong-arg': 'nope', //ignored
              },
            ],
          };
          const { status, ignoredConditions } = checkContextMatchesConditions(filtersNestedSimple, context);
          expect(status).toEqual(true);
          expect(ignoredConditions[0]).toMatchObject({ conditionalOperator: 'wrong-arg' });
        });

        test(`should work with multiple AND, OR and NOT`, async () => {
          const filtersNestedSimple = {
            'NOT': [ // true
              {
                'organisation_plateform_director_name__endsWith_i': 'victor', // false
                'AND': [ // false
                  {
                    'NOT': [
                      { // false
                        'organisation_name__isnIn': ['42', 'epitech', '101'], // true
                        'organisation_plateform_type__ne': 'school', // false
                      },
                    ],
                    'organisation_plateform_grade__isnIn': ['A', 'B', 'C'], // false
                  },
                ],
              },
            ],
          };
          expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': true });
        });

        test(`should work with multiple AND, OR and NOT to false`, async () => {
          const filtersNestedSimple = {
            'NOT': [ // false
              {
                'organisation_plateform_director_name__endsWith_i': 'victor', // false
                'AND': [// true
                  {
                    'NOT': [
                      {// true
                        'organisation_name__isnIn': ['skema', '42', 'epitech', '101'], // false
                        'organisation_plateform_type__ne': 'school', // false
                      },
                    ],
                    'organisation_plateform_grade__isIn': ['A', 'B', 'C'], // true
                  },
                ],
              },
            ],
          };
          expect(checkContextMatchesConditions(filtersNestedSimple, context)).toMatchObject({ 'status': false });
        });
      });
    });

    describe('handle missing context', () => {
      test('AND filter and totally empty context should be true', async () => {
        const filter = {
          'AND': [
            {
              'name': 'EPITECH',
            },
          ],
        };
        const ret = checkContextMatchesConditions(filter, {});
        expect(ret.status).toEqual(true);
        expect(ret.ignoredConditions).toHaveLength(1);
        expect(ret.ignoredConditions[0].expected).toBeUndefined();

      });
      test('AND filter and empty context should be true', async () => {
        const filter = {
          'AND': [{ 'name': 'EPITECH', 'age': 18 }],
        };
        const context = {
          'age': 18,
        };
        const ret = checkContextMatchesConditions(filter, context);
        expect(ret.status).toEqual(true);
        expect(ret.ignoredConditions).toHaveLength(1);
        expect(ret.ignoredConditions[0].expected).toBeUndefined();
      });
      test('NOT filter and empty context should be true', async () => {
        const filter = {
          'NOT': [{ 'name': 'EPITECH', 'age': 21 }],
        };
        const context = {
          'age': 18,
        };
        const ret = checkContextMatchesConditions(filter, context);
        expect(ret.status).toEqual(true);
        expect(ret.ignoredConditions).toHaveLength(1);
        expect(ret.ignoredConditions[0].expected).toBeUndefined();
      });
      test('OR filter and empty context should be true ', async () => {
        const filter = {
          'OR': [{ 'name': 'EPITECH', 'age': 18 }],
        };
        const context = {
          'age': 18,
        };
        const ret = checkContextMatchesConditions(filter, context);
        expect(ret.status).toEqual(true);
        expect(ret.ignoredConditions).toHaveLength(1);
        expect(ret.ignoredConditions[0].expected).toBeUndefined();
      });
      test('AND filter and empty context should return false', async () => {
        const filter = {
          'AND': [{ 'name': 'EPITECH', 'age': 21 }],
        };
        const context = {
          'age': 18,
        };
        const ret = checkContextMatchesConditions(filter, context);
        expect(ret.status).toEqual(false);
        expect(ret.ignoredConditions).toHaveLength(1);
        expect(ret.ignoredConditions[0].expected).toBeUndefined();
      });
    });

    describe('handle strict match option', () => {
      test('should not match when the context does not contain a value for all properties, when enabling strictMatch option', async () => {
        const filter = {
          'AND': [{ 'name': 'EPITECH', 'age': 18 }], // XXX Expects the context to contain ALL properties that are expected in the context (strict mode). If any is missing, then it's considered as a mismatch.
        };
        const context = {
          'age': 18,
        };
        const ret = checkContextMatchesConditions(filter, context, { 'strictMatch': true });
        expect(ret.status).toEqual(false);
        expect(ret.ignoredConditions).toBeNull();
        expect(ret.reason).toBeDefined();
      });

      test('should match when the context does not contain a value for all properties, when disabling strictMatch option', async () => {
        const filter = {
          'AND': [{ 'name': 'EPITECH', 'age': 18 }], // XXX Doesn't expect the context to contain all properties, will match based on what's available within the context (no strict mode).
        };
        const context = {
          'age': 18,
        };
        const ret = checkContextMatchesConditions(filter, context, { 'strictMatch': false });
        expect(ret.status).toEqual(true);
        expect(ret.ignoredConditions).toHaveLength(1);
        // console.log(ret)
        // expect(ret.reason).toBeDefined(); // FIXME should be defined
      });
    });
  });
});
