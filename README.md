# TemplateHelpers

This provides simple tools for Blaze such as in-template collection manipulation (may be totally unnecessary since it can be done in helpers, but whatever) and generalized order computations.

See the examples in `./mildly-horrifying-examples/` (just run meteor) [[rawgit link](https://rawgit.com/convexset/meteor-template-helpers/master/public/sample_output.html)].

## Install

This is available as [`convexset:template-helpers`](https://atmospherejs.com/convexset/template-helpers) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:template-helpers`.)

## Collection Manipulation

### Object / Array Manipulation

First have a look at the examples in `./mildly-horrifying-examples/` (just run meteor) [[rawgit link](https://rawgit.com/convexset/meteor-template-helpers/master/public/sample_output.html)], which should make things clear.

`getProperty(propertyName, obj)`: returns the value of a property

**Example**: `{{getProperty 'name' user}}` where `user` refers to a helper that returns `{name: 'bob', age: 8}` will render the text "bob".

`appendContext(obj, context)`: behaves like `_.extend`, returns an object equal to `obj` with the properties of `context` tacked on. (Does not mutate `obj`).

**Example Use**: `{{someOtherHelper (appendContext baseObj context)}}`

`arrayify0Args()` thru `arrayify100Args(x1, x2, ..., x100)`: takes in `n` arguments and returns an array of all `n` arguments. Paraphrasing immortal words: "100 parameters ought to be enough for anybody."

**Example**: `{{#each arrayify3Args 1 2 3}}{{this}} {{/each}}` renders the text "1 2 3".

`repackageDictionaryAsArray(obj)`: returns an array of `{key: keyName, value: value}` objects based on the properties of `obj`.

`flatten(arrayOfArrays)`: flattens an array of arrays by concatenation.

**Example**: `{{#each flatten (arrayify3 (arrayify2Args 1 2) (arrayify2Args 3 4) 5)}}{{this}} {{/each}}` renders the text "1 2 3 4 5".

`enumerate(arr)`: Generates an array of `{idx: idx, value: value}` items.

**Example**: `<ul>{{#each enumerate (arrayify3Args 10 20 'goose')}}<li>{{idx}}: {{value}}</li>{{/each}}</ul>` renders the list:
- 0: 10
- 1: 20
- 2: goose

`enumerateWithAddedContext(arr, context)`: Generates an array of `{idx: idx, value: value, context: context}` items

**Example Use**: `{{#each enumerateAndExtendByContext someArray context}}`

`enumerateAndExtendByContext(arr, context)`: Generates an array of `{idx: idx, value: value}` items extended by the given context (i.e.: `_.extend(`{idx: idx, value: value, ...}, context)`).

**Example Use**: `{{#each enumerateAndExtendByContext someArray context}}`

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

See examples in `./mildly-horrifying-examples/` (just run meteor) [[rawgit link](https://rawgit.com/convexset/meteor-template-helpers/master/public/sample_output.html)] for greater clarity.

## Order Tools

Provides helpers that compare two values:
- `greaterThan`
- `greaterThanOrEqualTo`
- `equalTo`
- `lessThanOrEqualTo`
- `lessThan`

**Example**: The code `{{#if greaterThan 2 1}}2 > 1{{else}}Surprise!!{{/if}}` renders the text "2 > 1".

The helpers use `compareGeneral(v1, v2)` (also exposed via `TemplateHelpers.compareGeneral`) which is a general comparator such that:
- Numbers: v1 - v2 > 0 --->
- Booleans: true > false
- Date: later > older
- Arrays ordered lexicographically (first index with inequality is determines outcome; else inconclusive/"equal")
- Strings: converted to arrays of char codes and compared as arrays of numbers
- Objects: common (own) properties ordered alphabetically and compared like an array of values

**Example**: The code `{{#if greaterThan (arrayify2Args 1 'b') (arrayify2Args 1 'a')}}[1, 'b'] > [1, 'a']{{else}}Surprise!!{{/if}}` renders the text "[1, 'b'] > [1, 'a']".


## Parent Template

`Blaze.TemplateInstance.prototype.parentTemplate = function(levels) { ... }`: returns the parent template `level` levels up. (Stolen from [here](http://stackoverflow.com/questions/27949407/how-to-get-the-parent-template-instance-of-the-current-template/27962713#27962713))