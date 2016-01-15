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

// defaults
UI.registerHelper('emptyArray', () => []);
UI.registerHelper('emptyObject', () => ({}));
UI.registerHelper('returnNull', () => null);
UI.registerHelper('now', () => new Date());

// uniq
UI.registerHelper('uniq', function uniq(arr) {
	var uniqElems = [];
	arr.forEach(function(elem) {
		var match = false;
		uniqElems.forEach(function(item) {
			match = match || _.isEqual(elem, item);
		});
		if (!match) {
			uniqElems.push(elem);
		}
	});
	return uniqElems;
});

// Join
UI.registerHelper('join', function join(arr, sep) {
	return arr.join(sep);
});

// Split
UI.registerHelper('split', function split(s, sep) {
	return s.split(sep);
});

// Range
UI.registerHelper('range', function range(num) {
	return _.range(num);
});

// Range
UI.registerHelper('rangeStartToEnd', function rangeStartToEnd(start, end) {
	return _.range(start, end);
});

// Range
UI.registerHelper('rangeStartToEndPlusStep', function rangeStartToEndPlusStep(start, end, step) {
	return _.range(start, end, step);
});

// First
UI.registerHelper('first', function first(arr) {
	return arr[0];
});

// Last
UI.registerHelper('last', function last(arr) {
	return arr[arr.length - 1];
});

// getElementAt
UI.registerHelper('getElementAt', function getElementAt(arr, idx) {
	return arr[idx];
});

function allIndicesOf(arr, v) {
	return _.map(arr, function(value, idx) {
		return {
			idx: idx,
			value: value
		};
	}).filter(x => _.isEqual(x.value, v)).map(x => x.idx);
}

// allIndicesOf
UI.registerHelper('allIndicesOf', allIndicesOf);

// indexOf
UI.registerHelper('indexOf', function indexOf(arr, v) {
	var indices = allIndicesOf(arr, v);
	return indices.length > 0 ? indices[0] : -1;
});

// contains
UI.registerHelper('contains', function contains(arr, v) {
	var indices = allIndicesOf(arr, v);
	return indices.length > 0;
});

// clump
UI.registerHelper('clump', function clump(arr, n) {
	var clumps = [];
	var this_clump = [];
	for (var idx = 0; idx < arr.length; idx++) {
		this_clump.push(arr[idx]);
		if (this_clump.length === n) {
			clumps.push(this_clump);
			this_clump = [];
		}
	}
	if (this_clump.length > 0) {
		clumps.push(this_clump);
	}
	return clumps;
});

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


// Length
UI.registerHelper('length', function length(arr) {
	return Object.keys(arr).length;
});


// Flattens an array of arrays by concatenation
UI.registerHelper('groupBy', function flatten(groupingFn, data) {
	var result = _.map(_.groupBy(data, groupingFn), function(data, key) {
		return {
			key: key,
			data: data
		};
	});
	return result;
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
	return (!!obj && (typeof obj[propertyName] !== "undefined")) ? obj[propertyName] : null;
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


function makeId(o) {
	return CryptoJS.SHA1((typeof o) + '_' + EJSON.stringify(o, {
		canonical: true
	})).toString(CryptoJS.enc.Base64);
}

// Iterate over with {{#each enumerate someArray}}
// Generates an array of {idx: idx, value: value} items
UI.registerHelper('enumerate', function enumerate(arr) {
	return _.map(arr, function(item, idx) {
		return {
			idx: idx,
			value: item,
			_id: makeId(idx + "_" + makeId(item)),
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
			_id: makeId(idx + "_" + makeId(item)),
			context: context
		};
	});
});


// Iterate over with {{#each enumerateAndExtendByContext someArray context}}
// Generates an array of {idx: idx, value: value, ...} items extended
// by the given context
UI.registerHelper('enumerateAndExtendByContext', function enumerateAndExtendByContext(arr, context) {
	return _.map(arr, function(item, idx) {
		return _.extend({
			_id: makeId(idx + "_" + makeId(item))
		}, context, {
			idx: idx,
			value: item,
		});
	});
});


// Iterate over with {{#each enumerateAndExtendByContext someArray context}}
// Generates an array of {idx: idx, value: value, ...} items extended
// by the given context (allows selection of names of idx field and item field)
UI.registerHelper('enumerateAndExtendByContextCustom', function enumerateAndExtendByContextCustom(arr, context, idxField, valueField) {
	return _.map(arr, function(item, idx) {
		return _.extend({
			_id: makeId(idx + "_" + makeId(item))
		}, context, _.object([
			[idxField, idx],
			[valueField, item]
		]));
	});
});