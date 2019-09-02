> This document describes the list of all available conditional operators in [src/conditionalOperators/index.ts](./src/conditionalOperators/index.ts).
 
# Flags
Flags are a way to change the behavior of operators, per property in the context.

- `i`: **Case insensitive**. By default, all conditional operators are case sensitive. Using this flag will perform a case insensitive comparison.

## Example
```js
const context = {
    'name':'Unly',
    'name__flags':['i']
}
```

---
# Conditional Operators

> Examples given here use the [`check`](./src/utils/check.ts) function, which is what's called internally by `contextMatcher` to check if the context matches the filter.
> `const check = (context: object, rule: string, value: any, options: IMap = defaultOptions)`

## Equals

### Definition
> This operator compares two elements and return true if they are strictly equal (for primitives/scalar types).
> For complex types (objects, arrays) the comparison is made based on the context (strictly equal as well). 
> **Also, this operator is the default operator if none are explicitly defined.**

### Aliases
* equals
* eq

### Example
```js
const context = {
    'school':{
        'name':'Unly',
        'city':'lyon',
        'city__flags':['i'], // The "city" attribute will be matched using "case insensitive" flag
        'postal_code':69000,
    }
};
check(context, 'school_name__eq', 'Unly'); // true
check(context, 'school_name__equals', 'unly'); // false
check(context, 'school_city__equals', 'LYON'); // true
check(context, 'school_city__equals', 'lyon'); // true
check(context, 'school_city__equals', 'lYOn'); // true
check(context, 'school', {'name':'Unly','postal_code':69000,}); // false 
check(context, 'school', {'name':'Unly', 'city':'lyon', 'postal_code':69000,}); // true 
```

## Not Equals

### Definition
> Check if two objects are strictly different.

### Aliases
* notEquals
* ne

### Example
```js
const context = {
    'school':{
        'name':'Unly',
        'city':'lyon',
        'city__flags':['i'],
        'postal_code':69000,
    }
};
check(context, 'school_name__ne', 'Unly'); // false
check(context, 'school_name__notEquals', 'unly'); // true
check(context, 'school_city__notEquals', 'LYON'); // false
check(context, 'school_city__notEquals', 'lyon'); // false
check(context, 'school_city__notEquals', 'lYOn'); // false
check(context, 'school__ne', {'name':'Unly','postal_code':69000,}); // true
check(context, 'school', {'name':'Unly', 'city':'lyon', 'postal_code':69000,}); // false 
```

## Starts With

### Definition
> Check if a string start with another.

### Aliases
* startsWith
* sw

### Example
```js
const context = {
    'school':{
        'name':'Unly',
        'city':'lyon',
        'city__flags':['i'],
        'postal_code':69000,
    }
};
check(context, 'school_name__sw', 'Un'); // true
check(context, 'school_name__sw', 'un'); // false
check(context, 'school_city__sw', 'LY'); // true
check(context, 'school_city__sw', 'ly'); // true
```

## Ends With

### Definition
> Check if a string finish by another.

### Aliases
* endsWith
* ew

### Example

```js
const context = {
    'school':{
        'name':'Unly',
        'city':'lyon',
        'city__flags':['i'],
        'postal_code':69000,
    }
};

check(context, 'school_name__sw', 'ly'); // true
check(context, 'school_name__sw', 'LY'); // false
check(context, 'school_city__sw', 'ON'); // true
check(context, 'school_city__sw', 'on'); // true
```

## Contains

### Definition
> String: Checks if the string contains a given string.
> Array: Checks if the array contains a specific element.
> Object: Checks if the object contains a specific element.

 ### Aliases
* contains
* inside
* in

### Example

```js
const context = {
    "name":"Paul",
    "location":{
        "city":"lyon",
        "post_code":69000
    },
    "campus":[42, "Unly"],
    "campus__flags":['i']
};
check(context, 'school_name__in', 'aul'); // true
check(context, 'school_location__in', {'city':"lyon"}); // true
check(context, 'school_campus__in', 42); // true
check(context, 'school_campus__in', 'Unly'); // true
check(context, 'school_campus__in', 'unly'); // true
```

## Not Contains

### Definition
> The opposite of "contains".
> String: Checks if the string does not contain a given string.
> Array: Checks if the array does not contain a specific element.
> Object: Checks if the object does not contain a specific element.

### Aliases
* notContains
* notIncludes
* nin

### Example

```js
const context = {
    "name":"Paul",
    "location":{
        "city":"lyon",
        "post_code":69000
    },
    "campus":[42, "Unly"],
    "campus__flags":['i']
};
check(context, 'school_name__nin', 'aul'); // false
check(context, 'school_location__nin', {'city':"lyon"}); // false
check(context, 'school_campus__nin', 42); // false
check(context, 'school_campus__nin', 'Unly'); // false
check(context, 'school_campus__nin', 'unly'); // false 
```

## Greater Than

### Definition
> Check if a value is greater than another.

### Aliases
* greaterThan
* gt

### Example

```js
const context = {
    "name":"Paul",
    'GPA':3,
};
check(context, 'GPA__gt', 2); // true
check(context, 'GPA__gt', '2'); // true TODO check not sure behaviour
```

## Greater Than or Equals

## definition 
> Check if a value is greater or equal than another.


### Aliases
* greaterThanEquals
* gte

### Example

```js
const context = {
    "name":"Paul",
    'GPA':3,
};
check(context, 'GPA__gte', 3); // true
check(context, 'GPA__gte', '3'); // true TODO check not sure behaviour
```

## Less Than

### Definition
> Check if a value is less than another.


### Aliases
* lessThan
* lt

### Example

```js
const context = {
    "name":"Paul",
    'GPA':3,
};
check(context, 'GPA__lt', 4); // true
check(context, 'GPA__lt', '4'); // true TODO check not sure behaviour
```
## Less Than or Equals

### Definition 
> Check if a value is less or equal than another.

### Aliases
* lessThanEquals
* lte
### Example

```js
const context = {
    "name":"Paul",
    'GPA':3,
};
check(context, 'GPA__lte', 3); // true
check(context, 'GPA__lte', '4'); // true
```
## Is Inside

### Definition
> String: Checks if the string is inside a given string.
> Array: Checks if a specific element is inside an array.
> Object: Checks if a specific element is inside an  object.

 ### Aliases
* isInside
* isIn

### Example

```js
const context = {
    "name":"Paul",
    "location":{
        "city":"lyon",
        "post_code":69000
    },
    "campus":[42, "Unly"],
    "campus__flags":['i']
};
check(context, 'school_name__isIn', ["Paul", "jake"]); // true
```

## Is Not Inside

### Definition
> The opposite of "inside".
> String: Checks if the string is inside a given string.
> Array: Checks if a specific element is inside an array.
> Object: Checks if a specific element is inside an  object.

### Aliases
* isNotInside
* isnIn

### Example

```js
const context = {
    "name":"Paul",
    "location":{
        "city":"lyon",
        "post_code":69000
    },
    "campus":[42, "Unly"],
    "campus__flags":['i']
};
check(context, 'school_name__isnIn', ["Paul","Jake"]); // false
```

---
# Conditional operators for arrays (batch)

> It is possible to mix both a conditional operator (as seen previously), with a "batch" operator to check a condition for a set of data.

## Every

### Definition
> Batch operator that checks if the condition is matched by all items in the data set.
> If any item fails to validate the condition, then it's a mismatch.

### Aliases
* every

### Example

```js
const context = {
  'students':[
    {'name':'Roger', 'GPA':3, "promotion":2021},
    {'name':'Paul', 'GPA':1, "promotion":2021},
    {'name':'Robert', 'GPA':2, "promotion":2021}
  ]
}
check(context, 'students_promotion__every_eq', 2021); // true
check(context, 'students_promotion__every_gte', 1); // true
check(context, 'students_promotion__every_lte', 2); // false
```


## Some

#### Definition
> Batch operator that checks if the condition is matched by any of the items in the data set.
> If any item succeed to validate the condition, then it's a match.

### Aliases
* some

### Example

```js
const context = {
  'students':[
    {'name':'Roger', 'GPA':3, "promotion":2021},
    {'name':'Paul', 'GPA':1, "promotion":2021},
    {'name':'Robert', 'name__flags': ['i'], 'GPA':2, "promotion":2021}
  ]
}
check(context, 'students_name__some_eq', 'robert'); // true
check(context, 'students_name__some_eq', 'roger'); // false
check(context, 'students_promotion__some_eq', 2); // true
check(context, 'students_promotion__some_lte', 1); // true
```

## None

#### Definition
> Batch operator that checks if the condition is matched by none of the items in the data set.
> If any item succeed to validate the condition, then it's a mismatch.

### Aliases
* none

### Example

```js
const context = {
  'students':[
    {'name':'Roger', 'GPA':3, "promotion":2021},
    {'name':'Paul', 'GPA':1, "promotion":2021},
    {'name':'Robert', 'name__flags': ['i'], 'GPA':2, "promotion":2021}
  ]
}
check(context, 'students_GPA__none_gte', 4); // true
check(context, 'students_GPA__none_gte', 3); // false
check(context, 'students_name__none_eq', 'Louis'); // true
check(context, 'students_name__none_sw', 'Rog'); // false
```
