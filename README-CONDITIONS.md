# Conditions

## equals
### alias 
* equals
* eq

### supported type
* object to object
* string to string
* number to number
* number to string
* array to array
* bool to bool

### example
* "string" equal "string" === true
* {"yes":42, "no":24} equal {"no":24, "yes":42} === true
* 42 equal "42" === true
* [42, 24] equal [42, 24] == true
* [24, 42] equal [42, 24] == false

## notEquals
### alias 

* notEquals
* ne

### supported type
* string
* number
* object
* array


### example
* "nostring" notEquals "string" === true

## contains

### alias
* contains
* includes
*in

### supported type
* string to string
* string to array
* number to array
* bool to array
* object to object

### example
* "ing" contains "string" === true
* "string" contains ["string", "42"] === true 
* {"name":"epi"} contains {"name":"epi", "number":42}===true

## notContains

### alias
* notContains
* notIncludes
* nin

### supported type
* string to string
* string to array

### example
* "tech" contains "string" === false
* "epitech" contains ["string", "42"] === false 

## greaterThan

### alias
* greaterThan
* gt

### supported type
* number to number

### example
* 42 greaterThan 24 === true
 
 
## greaterThanEquals

### alias
* greaterThanEquals
* gte

### supported type
* number to number

### example
* 42 greaterThanEquals 24

## lessThan

### alias
* lessThan
* lt

### supported type
* number to number

### example
* 24 less 42 === true

##lessThanEquals

### alias
* lessThanEquals
* lte

### supported type
* number to number

### example
* 24 less 42 === true

## startsWith

### alias
* startsWith
* sw

### supported type
* string to string

### example
"string" startsWith "str" === true

## endsWith

### alias
* endsWith
* ew

### supported type
* string to string

### example
"string" endsWith "ing" === true
