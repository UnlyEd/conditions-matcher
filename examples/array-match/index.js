import contextMatcher from '@unly/conditions-matcher';

const areGoodSchoolsCondition = {
  'schools_rate__every_lte': 3.5,
};

const someBeginByCondition = {
  'schools_rate__some_startsWith': 'IS',
};

const noneRateByCondition = {
  'schools_rate__none_lte': 3.5,
};

const context = {
  schools: [
    {
      name: 'ISS',
      rate: 4.2,
    },
    {
      name: 'ISE',
      rate: 3.7,
    },
    {
      name: 'ICSE',
      rate: 4.3,
    },
  ],
};

const areGoodSchools = contextMatcher(areGoodSchoolsCondition, context);
console.log(areGoodSchools);
// { status: true, ignoredConditions: null }

const someBeginBy = contextMatcher(someBeginByCondition, context);
console.log(someBeginBy);
// { status: true, ignoredConditions: null }

const noneRateBy = contextMatcher(noneRateByCondition, context);
console.log(noneRateBy);
// { status: true, ignoredConditions: null }

