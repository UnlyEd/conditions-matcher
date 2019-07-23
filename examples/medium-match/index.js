import contextMatcher from '@unly/conditions-matcher';

const isInNewYorkCondition = {
  'school_location_city': "New York",
  //same : 'school_location_city__eq': "New York",
};

const isGoodSchoolCondition = {
  'school_rate__gt': 4.5,
};

const mediumCondition = {
  'AND': [{ //true
    'school_name': 'ISS', //true
    'NOT': [{ //true
      'school_rate__lte': 3, //false
    }],
    'OR': [{ //true
      'school_location_city__in': ['New York', 'New Jersey', 'Mexico City'], //true
      'rate__lte': 2.5 //false
    }]
  }]
}

const context = {
  school: {
    name: 'ISS',
    location: {
      address: "160 Broadway",
      city: "New York",
      country: 'U.S.'
    },
    rate: 4.6
  },
};

const isInNewYork = contextMatcher(isInNewYorkCondition, context);
console.log(isInNewYork);
// { status: true, ignoredConditions: null }

const isGoodSchool = contextMatcher(isGoodSchoolCondition, context);
console.log(isGoodSchool);
// { status: true, ignoredConditions: null }

const mediumResults = contextMatcher(mediumCondition, context);
console.log(mediumResults);
// { status: true, ignoredConditions: null }

