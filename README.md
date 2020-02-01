<a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" align="right" height="20" alt="Unly logo" title="Unly logo" /></a>
[![Maintainability](https://api.codeclimate.com/v1/badges/d8318651d334711f79dc/maintainability)](https://codeclimate.com/github/UnlyEd/conditions-matcher/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d8318651d334711f79dc/test_coverage)](https://codeclimate.com/github/UnlyEd/conditions-matcher/test_coverage)
[![DeepScan grade](https://deepscan.io/api/teams/5275/projects/7050/branches/65346/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5275&pid=7050&bid=65346)
[![Build Status](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiWGQ3V2dEdGpUendlc05TRm5RWXZzejJCRDFVb09maFJqSzRmKzh4aUZzSVY3Qk9nZ2hMTmV0Z3VtOUJQYW5Hd3diZnlvMXhFUnhIQjVEc0RnRm9XTnRnPSIsIml2UGFyYW1ldGVyU3BlYyI6Ii9NdXdzQ2JNQ2lLUWZQR04iLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://eu-west-1.console.aws.amazon.com/codesuite/codebuild/projects/conditions-matcher/history)
[![Known Vulnerabilities](https://snyk.io/test/github/UnlyEd/conditions-matcher/badge.svg?targetFile=package.json)](https://snyk.io/test/github/UnlyEd/conditions-matcher?targetFile=package.json)

# Conditions-matcher

> Compares a given context with a filter (a set of conditions) and resolves whether the context checks the filter.
> Strongly inspired by [GraphQL filters](https://www.prisma.io/docs/reference/prisma-api/queries-ahwee4zaey#filtering-by-field).

**Use cases are**:
- Compare a given context with a set or conditions, to see if it matches those conditions
- We use it at [Unly](https://unly.org/) to resolve which **financing solutions** apply to a **student**, depending on that **student's situation**

The biggest strengths of this plugin are:
- **Flexibility**: You compose your own filter, by defining conditions within it that depends on **your** business logic. 
  - You have access to a wide range of conditional operators (`contains`, `endsWith`, `greaterThan`, etc.).
  - You have access to the same logical operators as those available in GraphQL (AND, OR, NOT).
  - You can nest those operators within themselves, without limit.
- **Robustness**: There is an important test suite (unit tests) written to make sure to detect regressions and only ship well-tested and quality software. _We also follow [Semantic Versioning](#semver)._

> This package was developed after opening a [StackOverflow question](https://stackoverflow.com/questions/56309234/algorithm-to-filter-data-structure-and-or-not-similar-to-graphql-implementation), we were disappointed not to find an existing implementation and therefore built our own.

<!-- toc -->

- [Getting started](#getting-started)
  * [Installation](#installation)
  * [Usage](#usage)
    + [Import in you project](#import-in-you-project)
    + [Function prototype](#function-prototype)
    + [Documentation](#documentation)
- [Contributing](#contributing)
  * [Working locally](#working-locally)
  * [Test](#test)
  * [Versions](#versions)
    + [SemVer](#semver)
    + [Release a new version](#release-a-new-version)
  * [Releasing and publishing](#releasing-and-publishing)
- [License](#license)
- [Vulnerability disclosure](#vulnerability-disclosure)
- [Contributors and maintainers](#contributors-and-maintainers)
- [**[ABOUT UNLY]**](#about-unly-)

<!-- tocstop -->

## Getting started

### Installation

Using npm :
```
npm i @unly/conditions-matcher
```
Using yarn :
```
yarn add @unly/conditions-matcher
```

### Usage

#### Import in you project
ES5
```js
const contextMatcher = require("@unly/conditions-matcher");
```

ES6
```js
import contextMatcher from "@unly/conditions-matcher";
```

See the [examples](./examples) for more details, clone the project to play around with those.
Then please check the conditional operators documentation [here](./README-CONDITIONAL-OPERATORS.md)

#### Function prototype
```ts
const result: boolean = contextMatcher(filter, context, options);
```

**filter**: Contains all the conditions that constitute the said filter. For a complete list of conditions and operators, [see the documentation](./README-CONDITIONAL-OPERATORS.md). Example :
```js
const filter = {
  AND: [
    { "school_gpa__lessThan": 3 },
    { "school_name__contains": "business" },
    { "foo__eq": "bar" },
  ],
};
```

**context**: Is an object containing the data (context) to match against the filter, to know whether it passes the conditions or not. Example :
```js
const context = {
  'school': {
      name: 'Awesome business school',
      gpa: 2.5
  },
};
```

**options**: Optional configuration object. 

**This example will return the following in `result`:**
```
{
  status: true, // Means the check passed, the context therefore passes the filter's conditions
  ignoredConditions: [ // Contains conditions that were ignored due to a lack of data in `context`
    {
      status: null, // "null" because no check could be performed (lack of data)
      rule: 'foo__eq',
      conditionalOperator: 'eq',
      path: 'foo',
      valueInContext: undefined,
      reason: 'Error: path: foo is not defined in context' // Human friendly error message, easier to reason about
    }
  ],
}
```

#### Documentation

##### Options
See [`defaultOptions`](./src/utils/constants.ts).

| Option name  | Default value | Description |
|--------------|---------------|--------------|
| `strictMatch` | false | This represents the behavior in case of non-existent context corresponds to the filter. Set to **true** if you want to return **false** in case of a value in the filter doesn't exist. |


---

## Contributing

We gladly accept PRs, but please open an issue first so we can discuss it beforehand.

### Working locally

```
yarn start # Shortcut - Runs linter + build + tests in concurrent mode (watch mode)

OR run each process separately for finer control

yarn lint
yarn build
yarn test
```


### Test

```
yarn test # Run all tests, interactive and watch mode
yarn test:once # Used for CI/CD
yarn test:coverage # Generate coverage report
```

### Versions

#### SemVer

We use Semantic Versioning for this project: https://semver.org/. (`vMAJOR.MINOR.PATCH`: `v1.0.1`)

- Major version: Must be changed when Breaking Changes are made (public API isn't backward compatible).
  - A function has been renamed/removed from the public API
  - Something has changed that will cause the app to behave differently with the same configuration
- Minor version: Must be changed when a new feature is added or updated (without breaking change nor behavioral change)
- Patch version: Must be changed when any change is made that isn't either Major nor Minor. (Misc, doc, etc.)

#### Release a new version

> Note: You should write the CHANGELOG.md doc before releasing the version. 
This way, it'll be included in the same commit as the built files and version update

Then, release a new version:

- `yarn run release`

This command will prompt you for the version to update to, create a git tag, build the files and commit/push everything automatically.

> Don't forget we are using SemVer, please follow our SemVer rules.

**Pro hint**: use `beta` tag if you're in a work-in-progress (or unsure) to avoid releasing WIP versions that looks legit


### Releasing and publishing

```
yarn releaseAndPublish # Shortcut - Will prompt for bump version, commit, create git tag, push commit/tag and publish to NPM

yarn release # Will prompt for bump version, commit, create git tag, push commit/tag
npm publish # Will publish to NPM
```

## License

MIT

# Vulnerability disclosure

[See our policy](https://github.com/UnlyEd/Unly).

---

# Contributors and maintainers

This project is being maintained by:
- [Unly] Ambroise Dhenain ([Vadorequest](https://github.com/vadorequest)) **(active)**
- [Contributor] Adrien Zemma ([Adrien-Zemma](https://github.com/Adrien-Zemma)) **(active)**

Thanks to our contributors:
- Hugo Martin ([Demmonius](https://github.com/Demmonius))

---

# **[ABOUT UNLY]** <a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" height="40" align="right" alt="Unly logo" title="Unly logo" /></a>

> [Unly](https://unly.org) is a socially responsible company, fighting inequality and facilitating access to higher education. 
> Unly is committed to making education more inclusive, through responsible funding for students. 
We provide technological solutions to help students find the necessary funding for their studies. 

We proudly participate in many TechForGood initiatives. To support and learn more about our actions to make education accessible, visit : 
- https://twitter.com/UnlyEd
- https://www.facebook.com/UnlyEd/
- https://www.linkedin.com/company/unly
- [Interested to work with us?](https://jobs.zenploy.io/unly/about)

Tech tips and tricks from our CTO on our [Medium page](https://medium.com/unly-org/tech/home)!

#TECHFORGOOD #EDUCATIONFORALL
