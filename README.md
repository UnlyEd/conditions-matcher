# Library Skeleton

This project is a skeleton for library open source

<!-- toc -->

- [Getting started](#getting-started)
- [Contributing](#contributing)
  * [Getting started](#getting-started-1)
  * [Test](#test)
  * [Releasing and publishing](#releasing-and-publishing)
- [License](#license)

<!-- tocstop -->

## Getting started

### Installation

Using npm :
```
npm i @unly/prisma-algorithm-matcher
```
Using yarn :
```
yarn add @unly/prisma-algorithm-matcher
```

### Usage
ES5
```js
const contextMatcher = require("@unly/prisma-algorithm-matcher");
```

ES6
```js
import checkContextMatchesConditions from "@unly/prisma-algorithm-matcher";
```

---

## Contributing

We gladly accept PRs, but please open an issue first so we can discuss it beforehand.

### Getting started

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
yarn test:once
yarn test:coverage
```

### Releasing and publishing

```
yarn releaseAndPublish # Shortcut - Will prompt for bump version, commit, create git tag, push commit/tag and publish to NPM

yarn release # Will prompt for bump version, commit, create git tag, push commit/tag
npm publish # Will publish to NPM
```

## License

MIT
