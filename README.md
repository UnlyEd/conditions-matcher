# Conditions-matcher

<!-- toc -->

- [Getting started](#getting-started)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Example](#example)
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
npm i @unly/conditions-matcher
```
Using yarn :
```
yarn add @unly/conditions-matcher
```

### Usage
ES5
```js
const contextMatcher = require("@unly/conditions-matcher");
```

ES6
```js
import contextMatcher from "@unly/conditions-matcher";
```

Then please check the conditions documentation [here](./README-CONDITIONS.md)

### Example
Simple context:
```js
const context = {
  'name': 'Jean',
  'age': 42,
  'address' : {
    'city' : 'Lyon',
    'country': 'France'
  }
}
```

Simple filter:
```js
const filter = {
  'AND': [
    {'name': 'Jean'}, //true Jean === Jean
    {'age__greaterThan': 40}, //true 42 > 40
  ]
}
```

The matcher will return **true**.

---

Middle filter:
```js
const filter = {
  'AND': [
    {
      'name': 'Jean', //true because Jean === Jean
      'NOT': [ //true beacause one input is false
        {'name': 'other-name'}, //false Jean !== other-name
        {'address_city__in': ['Paris', 'London', 'Lyon']} //true Lyon is in cities array
      ]
    }
  ]
}
```

The matcher will return **true**.


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
