import contextMatcher from '@unly/conditions-matcher';

const matchingConditions = {
  'organisation_name': 'unly',
};
const unMatchingConditions = {
  'organisation_name': 'random',
};

const context = {
  organisation: {
    name: 'unly',
  },
};

const match = contextMatcher(matchingConditions, context);
console.log(match);
// { status: true, ignoredConditions: null }

const nomatch = contextMatcher(unMatchingConditions, context);
console.log(nomatch);
// {
//   status: false,
//   reason: 'Fail because "unly" is not equal "random"',
//   ignoredConditions: null
// }
