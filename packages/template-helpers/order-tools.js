/* global TemplateHelpers: true */

// Greater than less than and so on
UI.registerHelper('greaterThan', function(v1, v2) {
	// console.log('greaterThan', v1, v2);
	return compareGeneral(v1, v2) > 0;
});

UI.registerHelper('greaterThanOrEqualTo', function(v1, v2) {
	// console.log('greaterThanOrEqualTo', v1, v2);
	return compareGeneral(v1, v2) >= 0;
});

UI.registerHelper('equalTo', function(v1, v2) {
	// console.log('equalTo', v1, v2);
	return compareGeneral(v1, v2) === 0;
});

UI.registerHelper('lessThanOrEqualTo', function(v1, v2) {
	// console.log('lessThanOrEqualTo', v1, v2);
	return compareGeneral(v1, v2) < 0;
});

UI.registerHelper('lessThan', function(v1, v2) {
	// console.log('lessThan', v1, v2);
	return compareGeneral(v1, v2) <= 0;
});


// Converts strings to arrays of numbers
// e.g.: "ABC" --> [65, 66, 67]
function stringToArrayOfCharCodes(s) {
	return Array.prototype.map.call(s, function(c) {
		return c.charCodeAt(0);
	});
}

/*
	Compares objects (recursively)
	 - Numbers: v1 - v2
	 - Booleans: true, false ---> 1
	 - Date: later > older
	 - Arrays in lexicographic order
	 - Strings: converted to arrays of char codes
	 - Objects: in (alphabetical) property order
*/
function compareGeneral(v1, v2) {
	// console.log(v1, v2, '|', typeof v1, typeof v2);

	if (typeof v1 !== typeof v2) {
		return 0;
	}

	if ((typeof v1 === "number") && (typeof v2 === "number")) {
		return v1 - v2;
	}

	if ((typeof v1 === "boolean") && (typeof v2 === "boolean")) {
		if (v1 && !v2) {
			return 1;
		}
		if (v1 === v2) {
			return 0;
		}
		if (v2 && !v1) {
			return -1;
		}
	}

	if ((v1 instanceof Date) && (v2  instanceof Date)) {
		return v1.getTime() - v2.getTime();
	}

	if ((typeof v1 === "string") && (typeof v2 === "string")) {
		return compareGeneral(stringToArrayOfCharCodes(v1), stringToArrayOfCharCodes(v2));
	}

	var idx;
	var result;

	if ((v1 instanceof Array) && (v2 instanceof Array)) {
		var n = Math.min(v1.length, v2.length);
		for (idx = 0; idx < n; idx++) {
			result = compareGeneral(v1[idx], v2[idx]);
			if (result !== 0) {
				return result;
			}
		}
		return v1.length - v2.length;
	}

	var properties = [];
	for (var k in v1) {
		if (v1.hasOwnProperty(k) && v2.hasOwnProperty(k)) {
			properties.push(k);
		}
	}
	properties.sort();
	for (idx = 0; idx < properties.length; idx++) {
		result = compareGeneral(v1[properties[idx]], v2[properties[idx]]);
		if (result !== 0) {
			return result;
		}
	}

	return 0;
}

// Export
(function(){
	if (typeof TemplateHelpers === "undefined") {
		TemplateHelpers = {};
	}
	TemplateHelpers.compareGeneral = compareGeneral;
})();