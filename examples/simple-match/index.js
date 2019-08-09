import contextMatcher from '@unly/conditions-matcher';

const checkOrganisationNameThatSucceeds = {
  'organisation_name': 'unly', // true
};
const checkOrganisationNameThatFails = {
  'organisation_name': 'random', // false
};

const context = {
  organisation: {
    name: 'unly', // false
  },
};

const checkOrganisationNameThatSucceedsResult = contextMatcher(checkOrganisationNameThatSucceeds, context);
console.log('checkOrganisationNameThatSucceedsResult\n', checkOrganisationNameThatSucceedsResult);
// { status: true, ignoredConditions: null }

const checkOrganisationNameThatFailsResult = contextMatcher(checkOrganisationNameThatFails, context);
console.log('checkOrganisationNameThatFailsResult\n', checkOrganisationNameThatFailsResult);
// {
//   status: false,
//   reason: 'Fail because "unly" is not equal "random"',
//   ignoredConditions: null
// }
