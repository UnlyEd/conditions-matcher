import contextMatcher from '../../lib/checkMatches';

const checkSchoolLocationCityThatSucceeds = {
  'school_location_city': 'New York',
  // This is identical to:
  // 'school_location_city__eq': "New York",
};

const checkSchoolRateGreaterThanThresholdThatSucceeds = {
  'school_rate__gt': 4.5, // true
};

const checkMultipleRulesThatSucceeds = {
  'AND': [
    { // true
      'school_name': 'ISS', // true
      'NOT': [
        { // true
          'school_rate__lte': 3, // false
        },
      ],
      'OR': [
        { // true
          'school_location_city__isIn': ['New York', 'New Jersey', 'Mexico City'], // true
          'school_rate__lte': 2.5, // false
        },
      ],
    },
  ],
};

const context = {
  school: {
    name: 'ISS',
    location: {
      address: '160 Broadway',
      city: 'New York',
      country: 'U.S.',
    },
    rate: 4.6,
  },
};

const checkSchoolLocationCityThatSucceedsResult = contextMatcher(checkSchoolLocationCityThatSucceeds, context);
console.log('checkSchoolLocationCityThatSucceedsResult\n', checkSchoolLocationCityThatSucceedsResult);
// { status: true, ignoredConditions: null }

const checkSchoolRateGreaterThanThresholdThatSucceedsResult = contextMatcher(checkSchoolRateGreaterThanThresholdThatSucceeds, context);
console.log('checkSchoolRateGreaterThanThresholdThatSucceedsResult\n', checkSchoolRateGreaterThanThresholdThatSucceedsResult);
// { status: true, ignoredConditions: null }

const checkMultipleRulesThatSucceedsResult = contextMatcher(checkMultipleRulesThatSucceeds, context);
console.log('checkMultipleRulesThatSucceedsResult\n', checkMultipleRulesThatSucceedsResult);
// { status: true, ignoredConditions: null }

