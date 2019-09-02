import contextMatcher from '../../lib/checkMatches';

const checkAllSchoolsRateLowerThanThresholdThatFails = {
  'schools_rate__every_lte': 4.2, // false
};

const checkSomeSchoolsNameStartsWithThatSucceeds = {
  'schools_name__some_startsWith': 'IS', // true
};

const checkSomeSchoolsNameStartsWithThatFails = {
  'schools_name__every_startsWith': 'IS', // false, because "ICSE" doesn't starts with "IS"
};

const checkAllSchoolsNameStartsWithInsensitiveThatSucceeds = {
  'schools_name__every_startsWith': 'I', // true
};

const checkNoSchoolsRateLowerThanThresholdThatSucceeds = {
  'schools_rate__none_lte': 3.5, // true
};

const context = {
  schools: [
    {
      name: 'ISS',
      name__flag: ["i"],
      rate: 4.2,
    },
    {
      name: 'ISE',
      name__flag: ["i"],
      rate: 3.7,
    },
    {
      name: 'ICSE',
      name__flag: ["i"],
      rate: 4.3,
    },
  ],
};

const checkAllSchoolsRateLowerThanThresholdThatFailsResult = contextMatcher(checkAllSchoolsRateLowerThanThresholdThatFails, context);
console.log('checkAllSchoolsRateLowerThanThresholdThatFailsResult\n', checkAllSchoolsRateLowerThanThresholdThatFailsResult);
// {
//   status: false,
//   reason: 'Fail because "[object Object],[object Object],[object Object]" is not every "3.5"',
//   ignoredConditions: null
// }

const checkSomeSchoolsNameStartsWithThatSucceedsResult = contextMatcher(checkSomeSchoolsNameStartsWithThatSucceeds, context);
console.log('checkSomeSchoolsNameStartsWithThatSucceedsResult\n', checkSomeSchoolsNameStartsWithThatSucceedsResult);
// { status: true, ignoredConditions: null }

const checkSomeSchoolsNameStartsWithThatFailsResult = contextMatcher(checkSomeSchoolsNameStartsWithThatFails, context);
console.log('checkSomeSchoolsNameStartsWithThatFailsResult\n', checkSomeSchoolsNameStartsWithThatFailsResult);
// {
//   status: false,
//   reason: 'Fail because "[object Object],[object Object],[object Object]" is not every "IS"',
//   ignoredConditions: null
// }

const checkSomeSchoolsNameStartsWithInsensitiveThatSucceedsResult = contextMatcher(checkAllSchoolsNameStartsWithInsensitiveThatSucceeds, context);
console.log('checkSomeSchoolsNameStartsWithInsensitiveThatSucceedsResult\n', checkSomeSchoolsNameStartsWithInsensitiveThatSucceedsResult);
// FIXME doesn't work as expected

const checkNoSchoolsRateLowerThanThresholdThatSucceedsResult = contextMatcher(checkNoSchoolsRateLowerThanThresholdThatSucceeds, context);
console.log('checkNoSchoolsRateLowerThanThresholdThatSucceedsResult\n', checkNoSchoolsRateLowerThanThresholdThatSucceedsResult);
// { status: true, ignoredConditions: null }

