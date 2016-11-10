import { Template } from 'meteor/templating';
import { Spacebars } from 'meteor/spacebars';
const _ = require('underscore');

// Not
Template.registerHelper('not', function not(x) {
	return !x;
});

// Ternary
Template.registerHelper('ternary', function ternary(x, a, b) {
	return !!x ? a : b;
});

// and
Template.registerHelper('and', function and() {
	const args = _.toArray(arguments);
	while (args[args.length - 1] instanceof Spacebars.kw) {
		args.pop();
	}
	return args.reduce((acc, y) => acc && y, true);
});

// or
Template.registerHelper('or', function or() {
	const args = _.toArray(arguments);
	while (args[args.length - 1] instanceof Spacebars.kw) {
		args.pop();
	}
	return args.reduce((acc, y) => acc || y, false);
});
