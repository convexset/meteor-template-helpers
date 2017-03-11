# TemplateHelpers

This provides simple tools for Blaze such as in-template collection manipulation (may be totally unnecessary since it can be done in helpers, but whatever) and generalized order computations.

See the examples in `./mildly-horrifying-examples/` (just run meteor) [[rawgit link](https://rawgit.com/convexset/meteor-template-helpers/master/public/sample_output.html)].

## Table of Contents

<!-- MarkdownTOC -->

- [Install](#install)
- [`Blaze.View` Extensions](#blazeview-extensions)
- [`Blaze.TemplateInstance` Extensions](#blazetemplateinstance-extensions)
- [Helpers](#helpers)
	- [Logic](#logic)
	- [Order](#order)
	- [Object Manipulation](#object-manipulation)
	- [Array Manipulation](#array-manipulation)
		- [Deprecated](#deprecated)
	- [Others](#others)
	- [Filter, Map, Reduce](#filter-map-reduce)

<!-- /MarkdownTOC -->


## Install

This is available as [`convexset:template-helpers`](https://atmospherejs.com/convexset/template-helpers) on [Atmosphere](https://atmospherejs.com/). (Install with `meteor add convexset:template-helpers`.)

If you get an error message like:
```
WARNING: npm peer requirements not installed:
 - underscore@^1.8.3 not installed.
          
Read more about installing npm peer dependencies:
  http://guide.meteor.com/using-packages.html#peer-npm-dependencies
```
It is because, by design, the package does not include instances of these from `npm` to avoid repetition. (In this case, `meteor npm install --save underscore` will deal with the problem.)

See [this](http://guide.meteor.com/using-packages.html#peer-npm-dependencies) or [this](https://atmospherejs.com/tmeasday/check-npm-versions) for more information.

Now, if you see a message like
```
WARNING: npm peer requirements not installed:
underscore@1.5.2 installed, underscore@^1.8.3 needed
```
it is because you or something you are using is using Meteor's cruddy old `underscore` package. Install a new version from `npm`. (And, of course, you may use the `npm` version in a given scope via `require("underscore")`.)


## `Blaze.View` Extensions

`Blaze.View#_isTemplateView`: (getter) returns whether a view has an attached template instance (traditional ones, including `Template.body`)

`Blaze.View#_closestAncestorWithTemplate`: (getter) returns the closest ancestor view with an attached template instance (traditional ones, including `Template.body`)

`Blaze.View#_closestAncestorWithTemplate_inclAllSorts`: (getter) returns the closest ancestor view with an attached template instance (all sorts ones, even `contentBlock`-types)

`Blaze.View#_hasAncestorView(view, stopAtTemplates = true)`: returns whether `view` is an ancestor of the current view (if `stopAtTemplates` is `true`, the search will stop at views with attached Templates instances as defined by `Blaze.View#_isTemplateView`)

`Blaze._getScope(elemOrView = null)`: Reactively obtains all visible scope variables with respect to the current view. Returns null if there is no current view, and an object with names of scope variables as keys along with the corresponding values (as values).

`Blaze._getScopeVariable(name, elemOrView = null)`: Reactively gets, by name, a value that is scoped to the current template through a `#let` or `#each-in` block. Returns null if there is no current view, and undefined if the no such name is in visible in the scope. Use within template code if needed, such as to figure out what `@index` is in an `#each-in` block.

`Blaze._iterativeLookup(name, { elemOrView } = {}, ...args)`: performs an iterative lookup on the current view of the specified element or view (`elemOrView`); calls functions with arguments `...args`; uses the following lookup order

 1. Scope Binding
 2. Parent (`../xxx`; pls. don't do this)
 3. Local Helper
 4. Lexical Binding
 5. Template by Name
 6. Data Context


## `Blaze.TemplateInstance` Extensions

`Blaze.TemplateInstance#parentTemplate(levels) { ... }`: returns the parent template `level` levels up. (Stolen from [here](http://stackoverflow.com/questions/27949407/how-to-get-the-parent-template-instance-of-the-current-template/27962713#27962713))

`Blaze.TemplateInstance#callFunctionWithTemplateContext(fn, context, arg1, arg2, ...)`: call function `fn` with context `context` and arguments `arg1`, `arg2`, ..., with `Template.instance()` accessible and pointing to current template instance.

`Blaze.TemplateInstance#applyFunctionWithTemplateContext(fn, context, args)`: apply function `fn` with context `context` and arguments `args`, with `Template.instance()` accessible and pointing to current template instance.

`Blaze.TemplateInstance#iterativeLookup(symbolName, ...args)`: Like performs an iterative lookup on the view of the current template (see [`Blaze._iterativeLookup`](#blazeview-extensions) above)

`Blaze.TemplateInstance#allNodes()`: All DOM Nodes

`Blaze.TemplateInstance#allElements()`: All DOM Nodes that are Elements (`nodeType=1`)


## Helpers

First have a look at the examples in `./mildly-horrifying-examples/` (just run meteor) [[rawgit link](https://rawgit.com/convexset/meteor-template-helpers/master/public/sample_output.html)], which should give examples for using the helpers.

### Logic

Already, one can do `{{#if true}}True{{else}}erm...{{/if}}` and `{{#if false}}erm...{{else}}False{{/if}}`. Now, if one does not want to use `#unless`, there is:

`not`: e.g.: `{{#if not true}}erm...{{else}}False{{/if}}`

`ternary`: e.g.: `{{ternary predicate a b}}` returns `predicate ? a : b`

`or`: e.g.: `{{or '55' false true}}` returns `'55'` (returns `false` if called with no arguments, as in "at least one of...")

`and`: e.g.: `{{and true true true true}}` returns `true` and `{{and 'ss' false 88}}` returns `88` (returns `true` if called with no arguments, as in "all of")

### Order

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


### Object Manipulation

`o(keyName, value)`: returns `{ [keyName]: value }`

`combineObjects(o1, o2, ...)`: returns `_.extend({}, o1, o2, ...)` see [this](http://underscorejs.org/#extend)

**Example**: `{{combineObjects (o 'name' user) (o 'id' 11232312)}}` returns `{name: user, id: 11232312}`

`getProperty(propertyName, obj)`: returns the value of a property

**Example**: `{{getProperty 'name' user}}` where `user` refers to a helper that returns `{name: 'bob', age: 8}` will render the text "bob".

`objToArray(o)`: identical to `repackageDictionaryAsArray`

`repackageDictionaryAsArray(o)`: returns an array of `{key: keyName, value: value}` objects based on the (enumerable) properties of `o`.


**(DEPRECATED)** `appendContext(obj, context)`: behaves like `_.extend`, returns an object equal to `obj` with the properties of `context` tacked on. (Does not mutate `obj`).

**Example Use**: `{{someOtherHelper (appendContext baseObj context)}}`

### Array Manipulation

**Note:** Deprecated helpers below.

`asArray(x1, x2, ...)`: returns an array of the supplied arguments

`first(arr)`: returns the first element of array `arr`

`last(arr)`: returns the last element of array `arr`

`getElementAt(arr, idx)`: returns the element at `idx` of `arr`

`indexOf(arr, v)`: returns the first index of element at `v` in `arr`

`allIndicesOf(arr, v)`: returns the all indices of element at `v` in `arr`

`contains(arr, v)`: returns whether element at `v` occurs in `arr`

`join(arr, sep)`: returns a string comprising elements of an array concatenated with `sep` as a separator.

`split(s, sep)`: returns an array arising from taking a string `s` and performing `s.split(sep)`.

`clump(arr, n)`: returns an array of arrays of at most `n` elements each, that collectively contain all the elements of `arr`. e.g.: `[0,1,2,3,4]` with `n=2` returns `[[0,1], [2,3], [4]]`. Useful for layouts with a maximum number of elements in each sub-collection (e.g.: row).

**Example**: `{{join (arrayify3Args 1 2 3) ', '}}` render the text "1, 2, 3".

`flatten(arrayOfArrays)`: flattens an array of arrays by concatenation.

**Example**: `{{#each flatten (arrayify3 (arrayify2Args 1 2) (arrayify2Args 3 4) 5)}}{{this}} {{/each}}` renders the text "1 2 3 4 5".

#### Deprecated

Use of `#let` and `#each-in` (and `@index`) renders these obsolete.

`arrayify0Args()` thru `arrayify100Args(x1, x2, ..., x100)`: takes in `n` arguments and returns an array of all `n` arguments. Paraphrasing immortal words: "100 parameters ought to be enough for anybody."

**Example**: `{{#each arrayify3Args 1 2 3}}{{this}} {{/each}}` renders the text "1 2 3".

`length(arr)`: Provides the length of an array.

**Example**: `{{#if greaterThan (length (arrayify2Args 3 4)) 0}}More than 0 elements{{/if}}` renders the text "More than 0 elements".

`enumerate(arr)`: Generates an array of `{idx: idx, value: value, _id: ...}` items. (`_id` is generated from a SHA1 hash of a serialized expression of the value, enabling #each blocks to react to changes)

**Example**: `<ul>{{#each enumerate (arrayify3Args 10 20 'goose')}}<li>{{idx}}: {{value}}</li>{{/each}}</ul>` renders the list:
- 0: 10
- 1: 20
- 2: goose

`enumerateWithAddedContext(arr, context)`: Generates an array of `{idx: idx, value: value, context: context, _id: ...}` items (`_id` is generated from a SHA1 hash of a serialized expression of the value, enabling #each blocks to react to changes)

**Example Use**: `{{#each enumerateAndExtendByContext someArray context}}`

`enumerateAndExtendByContext(arr, context)`: Generates an array of `{idx: idx, value: value, _id: ...}` items extended by the given context (actually, `{_id: ...}` may get overwritten by parts of `context` which may then be overwritten by parts of `{idx: idx, value: value}`.

`enumerateAndExtendByContextCustom(arr, context, idxField, valueField)`: Similar to the above, just that the name of the `idx` and `value` fields may be customized.

**Example Use**: `{{#each enumerateAndExtendByContext someArray context}}`

### Others

`emptyArray`: returns an empty array

`emptyObject`: returns an empty object

`returnNull`: returns `null`

`now`: returns the current date

`uniq(arr)`: returns an array of the unique items of `arr` using [`_.isEqual`](http://underscorejs.org/#isEqual) as a comparator.

`range(num)`, `rangeStartToEnd(start, end)` and `rangeStartToEndPlusStep(start, end, step)` provide the various forms of [`_.range`](http://underscorejs.org/#range).

`sort(arr)`: returns array in sorted order

`sortBy(propName, arr)`: returns in sorted order by some property

`reverse(arr)`: returns array in reversed order

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
