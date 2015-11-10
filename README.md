# TemplateHelpers

This provides simple tools for Blaze such as in-template collection manipulation (may be totally unnecessary since it can be done in helpers, but whatever) and generalized order computations.

See the examples in `./mildly-horrifying-examples/` (just run meteor) [[rawgit link](https://rawgit.com/convexset/meteor-template-helpers/master/public/sample_output.html)].

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Usage](#usage)
  - [Object Manipulation](#object-manipulation)
  - [Array Manipulation](#array-manipulation)
  - [Others](#others)
  - [Filter, Map, Reduce](#filter-map-reduce)
- [Logic](#logic)
- [Order Tools](#order-tools)
- [Parent Template](#parent-template)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

This is available as [`convexset:template-helpers`](https://atmospherejs.com/convexset/template-helpers) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:template-helpers`.)

## Usage

First have a look at the examples in `./mildly-horrifying-examples/` (just run meteor) [[rawgit link](https://rawgit.com/convexset/meteor-template-helpers/master/public/sample_output.html)], which should make things clear.

### Object Manipulation

`getProperty(propertyName, obj)`: returns the value of a property

**Example**: `{{getProperty 'name' user}}` where `user` refers to a helper that returns `{name: 'bob', age: 8}` will render the text "bob".

`appendContext(obj, context)`: behaves like `_.extend`, returns an object equal to `obj` with the properties of `context` tacked on. (Does not mutate `obj`).

**Example Use**: `{{someOtherHelper (appendContext baseObj context)}}`

`repackageDictionaryAsArray(obj)`: returns an array of `{key: keyName, value: value}` objects based on the properties of `obj`.

### Array Manipulation

`arrayify0Args()` thru `arrayify100Args(x1, x2, ..., x100)`: takes in `n` arguments and returns an array of all `n` arguments. Paraphrasing immortal words: "100 parameters ought to be enough for anybody."

**Example**: `{{#each arrayify3Args 1 2 3}}{{this}} {{/each}}` renders the text "1 2 3".

`first(arr)`: returns the first element of array `arr`

`last(arr)`: returns the last element of array `arr`

`getElementAt(arr, idx)`: returns the element at `idx` of `arr`

`indexOf(arr, v)`: returns the first index of element at `v` in `arr`

`allIndicesOf(arr, v)`: returns the all indices of element at `v` in `arr`

`contains(arr, v)`: returns whether element at `v` occurs in `arr`

`join(arr, sep)`: returns an array concatenated with `sep` as a separator.

`clump(arr, n)`: returns an array of arrays of at most `n` elements each, that collectively contain all the elements of `arr`. e.g.: `[0,1,2,3,4]` with `n=2` returns `[[0,1], [2,3], [4]]`. Useful for layouts with a maximum number of elements in each sub-collection (e.g.: row).

**Example**: `{{join (arrayify3Args 1 2 3) ', '}}` render the text "1, 2, 3".

`flatten(arrayOfArrays)`: flattens an array of arrays by concatenation.

**Example**: `{{#each flatten (arrayify3 (arrayify2Args 1 2) (arrayify2Args 3 4) 5)}}{{this}} {{/each}}` renders the text "1 2 3 4 5".

`length(arr)`: Provides the length of an array.

**Example**: `{{#if greaterThan (length (arrayify2Args 3 4)) 0}}More than 0 elements{{/if}}` renders the text "More than 0 elements".

`enumerate(arr)`: Generates an array of `{idx: idx, value: value}` items.

**Example**: `<ul>{{#each enumerate (arrayify3Args 10 20 'goose')}}<li>{{idx}}: {{value}}</li>{{/each}}</ul>` renders the list:
- 0: 10
- 1: 20
- 2: goose

`enumerateWithAddedContext(arr, context)`: Generates an array of `{idx: idx, value: value, context: context}` items

**Example Use**: `{{#each enumerateAndExtendByContext someArray context}}`

`enumerateAndExtendByContext(arr, context)`: Generates an array of `{idx: idx, value: value}` items extended by the given context (i.e.: `_.extend(`{idx: idx, value: value, ...}, context)`).

**Example Use**: `{{#each enumerateAndExtendByContext someArray context}}`

### Others

`uniq(arr)`: returns an array of the unique items of `arr` using [`_.isEqual`](http://underscorejs.org/#isEqual) as a comparator.

`range(num)`, `rangeStartToEnd(start, end)` and `rangeStartToEndPlusStep(start, end, step)` provide the various forms of [`_.range`](http://underscorejs.org/#range).

### Filter, Map, Reduce

We have the usual
- `filter(filterFn, arr)`
- `map(mapFn, arr)`
- `reduce(reduceFn, arr)`
- `reduceWithInitialValue(reduceFn, arr, initialValue)`

... and parameterized versions
- `filterParameterized(filterFn, params, arr)`
- `mapParameterized(mapFn, params, arr)`
- `reduceParameterized(reduceFn, params, arr)`
- `reduceParameterizedWithInitialValue(reduceFn, params, arr, initialValue)`

The parameterized versions, are equivalent to calling the non-parameterized versions with functions `fn(param, ...)` ("curried" by partial application with the parameter `param`).

... also, there is `groupBy(groupingFn, data)` which returns an array of objects `{key: this_key, data: data_grouped_to_this_key}` such that all elements in `.data` return `this_key` when passed through `groupingFn`.


See examples in `./mildly-horrifying-examples/` (just run meteor) [[rawgit link](https://rawgit.com/convexset/meteor-template-helpers/master/public/sample_output.html)] for greater clarity.

## Logic

Already, one can do `{{#if true}}True{{else}}erm...{{/if}}` and `{{#if false}}erm...{{else}}False{{/if}}`. Now, if one does not want to use `#unless`, there is:

`not`: e.g.: `{{#if not true}}erm...{{else}}False{{/if}}`

`ternary`: e.g.: `{{ternary predicate a b}}` returns `predicate ? a : b`

## Order Tools

Provides helpers that compare two values:
- `greaterThan`
- `greaterThanOrEqualTo`
- `equalTo`
- `lessThanOrEqualTo`
- `lessThan`

**Example**: The code `{{#if greaterThan 2 1}}2 > 1{{else}}Surprise!!{{/if}}` renders the text "2 > 1".

The helpers use `compareGeneral(v1, v2)` (also exposed via `TemplateHelpers.compareGeneral`) which is a general comparator such that:
- Numbers: v1 - v2 > 0 ---> true
- Booleans: true > false
- Date: later > older
- Arrays ordered lexicographically (first index with inequality is determines outcome; else inconclusive/"equal")
- Strings: converted to arrays of char codes and compared as arrays of numbers
- Objects: common (own) properties ordered alphabetically and compared like an array of values

**Example**: The code `{{#if greaterThan (arrayify2Args 1 'b') (arrayify2Args 1 'a')}}[1, 'b'] > [1, 'a']{{else}}Surprise!!{{/if}}` renders the text "[1, 'b'] > [1, 'a']".


## Parent Template

`Blaze.TemplateInstance.prototype.parentTemplate = function(levels) { ... }`: returns the parent template `level` levels up. (Stolen from [here](http://stackoverflow.com/questions/27949407/how-to-get-the-parent-template-instance-of-the-current-template/27962713#27962713))