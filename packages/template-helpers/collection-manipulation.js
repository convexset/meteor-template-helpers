// Generates argument concatenators
// Takes 0 to 100 arguments and returns an array
// e.g.: arrayify5Args x1 x2 x3 x4 x5 ---> [x1, x2, x3, x4, x5]
// jshint evil: true
_.range(0, 100 + 1).map(function(num_args) {
	var fnName = 'arrayify' + num_args + 'Args';
	var argList = _.range(num_args).map(idx => 'x' + idx);
	var fnStr = "return [" + argList.join(', ') + "];";
	UI.registerHelper(fnName, new Function(argList, fnStr));
});
// jshint evil: false


// Flattens an array of arrays by concatenation
UI.registerHelper('flatten', function flatten(arrayOfArrays) {
	return arrayOfArrays.reduce(function(currValue, nextValue) {
		if (nextValue instanceof Array) {
			return currValue.concat(nextValue);
		} else {
			currValue.push(nextValue);
			return currValue;
		}
	}, []);
});


// Generates an of objects extended with context
UI.registerHelper('appendContext', function appendContext(obj, context) {
	var o = _.extend({}, obj);
	return _.extend(o, context);
});


// Does filtering
UI.registerHelper('filter', function filter(filterFn, arr) {
	return arr.filter(filterFn);
});


// Does mapping
UI.registerHelper('map', function map(mapFn, arr) {
	return arr.map(mapFn);
});


// Does reduction
UI.registerHelper('reduce', function reduce(reduceFn, arr) {
	return arr.reduce(reduceFn);
});


// Does reduction with initial value
UI.registerHelper('reduceWithInitialValue', function reduceWithInitialValue(reduceFn, arr, initialValue) {
	return arr.reduce(reduceFn, initialValue);
});


// Does filtering with a parameterized function
// equivalent to arr.filter(fn_p) where fn_p is fn(param, .)
UI.registerHelper('filterParameterized', function filterParameterized(filterFn, params, arr) {
	return arr.filter(x => filterFn(params, x));
});

// Does mapping with a parameterized function
// equivalent to arr.map(fn_p) where fn_p is fn(param, .)
UI.registerHelper('mapParameterized', function mapParameterized(mapFn, params, arr) {
	return arr.map(x => mapFn(params, x));
});

// Does reduction with a parameterized function
// equivalent to arr.reduce(fn_p) where fn_p is fn(param, .)
UI.registerHelper('reduceParameterized', function reduceParameterized(reduceFn, params, arr) {
	return arr.reduce((currVal, nextVal, index, array) => reduceFn(params, currVal, nextVal, index, array));
});

// Does reduction with a parameterized function and an initial value
// equivalent to arr.reduce(fn_p) where fn_p is fn(param, .)
UI.registerHelper('reduceParameterizedWithInitialValue', function reduceParameterizedWithInitialValue(reduceFn, params, arr, initialValue) {
	return arr.reduce((currVal, nextVal, index, array) => reduceFn(params, currVal, nextVal, index, array), initialValue);
});

// Generates an of objects extended with context
UI.registerHelper('getProperty', function getProperty(propertyName, obj) {
	return obj[propertyName];
});


// Repackage dictionary as an array of {key: ..., value: ...} elements
// Iterate over with {{#each repackageDictionaryAsArray someDictionary}}
// Of course, dictionary ~= object and obviously the original committer
// likes Python.
UI.registerHelper('repackageDictionaryAsArray', function repackageDictionaryAsArray(obj) {
	var result = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			// console.log('[repackageDictionaryAsArray]', key, obj[key]);
			result.push({
				key: key,
				value: obj[key]
			});
		}
	}
	return result;
});


// Iterate over with {{#each enumerate someArray}}
// Generates an array of {idx: idx, value: value} items
UI.registerHelper('enumerate', function enumerate(arr) {
	return _.map(arr, function(item, idx) {
		return {
			idx: idx,
			value: item
		};
	});
});


// Iterate over with {{#each enumerateWithAddedContext someArray context}}
// Generates an array of {idx: idx, value: value, context: context} items
UI.registerHelper('enumerateWithAddedContext', function enumerateWithAddedContext(arr, context) {
	return _.map(arr, function(item, idx) {
		return {
			idx: idx,
			value: item,
			context: context
		};
	});
});


// Iterate over with {{#each enumerateAndExtendByContext someArray context}}
// Generates an array of {idx: idx, value: value, ...} items extended
// by the given context
// Use carefully. Do not overwrite idx and value.... pls....... really. don't.
UI.registerHelper('enumerateAndExtendByContext', function enumerateAndExtendByContext(arr, context) {
	return _.map(arr, function(item, idx) {
		return _.extend({
			idx: idx,
			value: item
		}, context);
	});
});