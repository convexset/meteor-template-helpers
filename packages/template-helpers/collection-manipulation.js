/* global compareGeneral: true */

import { Template } from 'meteor/templating';
import { Spacebars } from 'meteor/spacebars';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
	'underscore': '^1.8.3',
});
const _ = require('underscore');


// as array
Template.registerHelper('asArray', function asArray() {
	const args = _.toArray(arguments);
	while (args[args.length - 1] instanceof Spacebars.kw) {
		args.pop();
	}
	return args;
});

Template.registerHelper('o', function o(k, v) {
	return {
		[k]: v
	};
});

Template.registerHelper('combineObjects', function combineObjects() {
	const args = _.toArray(arguments);
	while (args[args.length - 1] instanceof Spacebars.kw) {
		args.pop();
	}
	return _.extend({}, ...args);
});


// Generates argument concatenators
// Takes 0 to 100 arguments and returns an array
// e.g.: arrayify5Args x1 x2 x3 x4 x5 ---> [x1, x2, x3, x4, x5]
// jshint evil: true
_.range(0, 100 + 1).map(function(num_args) {
	var fnName = 'arrayify' + num_args + 'Args';
	var argList = _.range(num_args).map(idx => 'x' + idx);
	var fnStr = "return [" + argList.join(', ') + "];";
	Template.registerHelper(fnName, new Function(argList, fnStr));
});
// jshint evil: false

// defaults
Template.registerHelper('emptyArray', () => []);
Template.registerHelper('emptyObject', () => ({}));
Template.registerHelper('returnNull', () => null);
Template.registerHelper('now', () => new Date());

// uniq
Template.registerHelper('uniq', function uniq(arr) {
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
Template.registerHelper('join', function join(arr, sep) {
	return arr.join(sep);
});

// Split
Template.registerHelper('split', function split(s, sep) {
	return s.split(sep);
});

// Range
Template.registerHelper('range', function range(num) {
	return _.range(num);
});

// Range
Template.registerHelper('rangeStartToEnd', function rangeStartToEnd(start, end) {
	return _.range(start, end);
});

// Range
Template.registerHelper('rangeStartToEndPlusStep', function rangeStartToEndPlusStep(start, end, step) {
	return _.range(start, end, step);
});

// First
Template.registerHelper('first', function first(arr) {
	return arr[0];
});

// Last
Template.registerHelper('last', function last(arr) {
	return arr[arr.length - 1];
});

// getElementAt
Template.registerHelper('getElementAt', function getElementAt(arr, idx) {
	return arr[idx];
});

function allIndicesOf(arr, v) {
	arr = arr || [];
	return _.map(arr, function(value, idx) {
		return {
			idx: idx,
			value: value
		};
	}).filter(x => _.isEqual(x.value, v)).map(x => x.idx);
}

// allIndicesOf
Template.registerHelper('allIndicesOf', allIndicesOf);

// indexOf
Template.registerHelper('indexOf', function indexOf(arr, v) {
	var indices = allIndicesOf(arr, v);
	return indices.length > 0 ? indices[0] : -1;
});

// contains
Template.registerHelper('contains', function contains(arr, v) {
	var indices = allIndicesOf(arr, v);
	return indices.length > 0;
});

// clump
Template.registerHelper('clump', function clump(arr, n) {
	arr = arr || [];
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
Template.registerHelper('flatten', function flatten(arrayOfArrays) {
	arrayOfArrays = arrayOfArrays || [];
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
Template.registerHelper('length', function length(arr) {
	arr = arr || [];
	return Object.keys(arr).length;
});


// Flattens an array of arrays by concatenation
Template.registerHelper('groupBy', function flatten(groupingFn, data) {
	data = data || [];
	var result = _.map(_.groupBy(data, groupingFn), function(data, key) {
		return {
			key: key,
			data: data
		};
	});
	return result;
});


// Generates an of objects extended with context
Template.registerHelper('appendContext', function appendContext(obj, context) {
	var o = _.extend({}, obj);
	return _.extend(o, context);
});


// Does filtering
Template.registerHelper('filter', function filter(filterFn, arr) {
	arr = arr || [];
	return arr.filter(filterFn);
});


// Does mapping
Template.registerHelper('map', function map(mapFn, arr) {
	arr = arr || [];
	return arr.map(mapFn);
});


// Does reduction
Template.registerHelper('reduce', function reduce(reduceFn, arr) {
	arr = arr || [];
	return arr.reduce(reduceFn);
});


// Does reduction with initial value
Template.registerHelper('reduceWithInitialValue', function reduceWithInitialValue(reduceFn, arr, initialValue) {
	arr = arr || [];
	return arr.reduce(reduceFn, initialValue);
});


// Does filtering with a parameterized function
// equivalent to arr.filter(fn_p) where fn_p is fn(param, .)
Template.registerHelper('filterParameterized', function filterParameterized(filterFn, params, arr) {
	arr = arr || [];
	return arr.filter(x => filterFn(params, x));
});

// Does mapping with a parameterized function
// equivalent to arr.map(fn_p) where fn_p is fn(param, .)
Template.registerHelper('mapParameterized', function mapParameterized(mapFn, params, arr) {
	arr = arr || [];
	return arr.map(x => mapFn(params, x));
});

// Does reduction with a parameterized function
// equivalent to arr.reduce(fn_p) where fn_p is fn(param, .)
Template.registerHelper('reduceParameterized', function reduceParameterized(reduceFn, params, arr) {
	arr = arr || [];
	return arr.reduce((currVal, nextVal, index, array) => reduceFn(params, currVal, nextVal, index, array));
});

// Does reduction with a parameterized function and an initial value
// equivalent to arr.reduce(fn_p) where fn_p is fn(param, .)
Template.registerHelper('reduceParameterizedWithInitialValue', function reduceParameterizedWithInitialValue(reduceFn, params, arr, initialValue) {
	arr = arr || [];
	return arr.reduce((currVal, nextVal, index, array) => reduceFn(params, currVal, nextVal, index, array), initialValue);
});

// Generates an of objects extended with context
Template.registerHelper('getProperty', function getProperty(propertyName, obj) {
	return (!!obj && (typeof obj[propertyName] !== "undefined")) ? obj[propertyName] : null;
});

// returns in sorted order
Template.registerHelper('sort', function(arr) {
	return _.isArray(arr) ? arr.sort(compareGeneral) : arr;
});

// reverse
Template.registerHelper('reverse', function(arr) {
	return _.isArray(arr) ? arr.reverse : [];
});

// returns in sorted order by some property
Template.registerHelper('sortBy', function(prop, arr) {
	return _.isArray(arr) ? arr.sort((x, y) => compareGeneral(x[prop], y[prop])) : arr;
});

// Repackage dictionary as an array of {key: ..., value: ...} elements
// Iterate over with {{#each repackageDictionaryAsArray someDictionary}}
// Of course, dictionary ~= object and obviously the original committer
// likes Python.
function repackageDictionaryAsArray(o) {
	return _.map(o, (v, k) => ({ key: k, value: v }));
}
Template.registerHelper('repackageDictionaryAsArray', repackageDictionaryAsArray);
Template.registerHelper('objToArray', repackageDictionaryAsArray);


function makeId(o) {
	return CryptoJS.SHA1((typeof o) + '_' + EJSON.stringify(o, {
		canonical: true
	})).toString(CryptoJS.enc.Base64);
}

// Iterate over with {{#each enumerate someArray}}
// Generates an array of {idx: idx, value: value} items
Template.registerHelper('enumerate', function enumerate(arr) {
	arr = arr || [];
	return _.map(arr, function(item, idx) {
		return {
			idx: idx,
			value: item,
			_id: makeId(idx + "_" + makeId(item)),
		};
	});
});


// Iterate over with {{#each enumerateNoId someArray}}
// Generates an array of {idx: idx, value: value} items
Template.registerHelper('enumerateNoId', function enumerate(arr) {
	arr = arr || [];
	return _.map(arr, function(item, idx) {
		return {
			idx: idx,
			value: item,
		};
	});
});


// Iterate over with {{#each enumerateWithAddedContext someArray context}}
// Generates an array of {idx: idx, value: value, context: context} items
Template.registerHelper('enumerateWithAddedContext', function enumerateWithAddedContext(arr, context) {
	arr = arr || [];
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
Template.registerHelper('enumerateAndExtendByContext', function enumerateAndExtendByContext(arr, context) {
	arr = arr || [];
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
Template.registerHelper('enumerateAndExtendByContextCustom', function enumerateAndExtendByContextCustom(arr, context, idxField, valueField) {
	arr = arr || [];
	return _.map(arr, function(item, idx) {
		return _.extend({
			_id: makeId(idx + "_" + makeId(item))
		}, context, _.object([
			[idxField, idx],
			[valueField, item]
		]));
	});
});