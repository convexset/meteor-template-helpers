if (Meteor.isClient) {
	Template.DemoCollection.helpers({
		things: function() {
			return _.range(5).map(function(idx) {
				return 'Thing ' + (idx + 1);
			});
		},
		someObj: function() {
			return {
				number: 1,
				string: "aaaa",
				date: new Date()
			};
		},
		myContext: function() {
			return {
				version: 1.0
			};
		},
		isEvenFn: function() {
			return function(x) {
				return x % 2 === 0;
			};
		},
		addVFn: function() {
			var fn = function add_v(v, x) {
				return x + v;
			};
			return fn;
		},
		add10Fn: function() {
			var fn = function add_10(x) {
				return x + 10;
			};
			return fn;
		},
		sumReducer: function() {
			return function(initVal, nextVal) {
				return initVal + nextVal;
			};
		},
		oddEvenGrouper: function() {
			return function(x) {
				return (x % 2 === 0) ? "Even" : "Odd";
			};
		},
	});

	Template.DemoCompare.helpers({
		str: function(v) {
			return EJSON.stringify(v, {
				canonical: true
			});
		},
		compareV1: function() {
			return ['ABC', {
				b: 5,
				a: 3
			}];
		},
		compareV2: function() {
			return ['ABC', {
				a: 3,
				b: 4,
			}];
		},
	});
}


if (Meteor.isServer) {
	Meteor.startup(function() {});
}