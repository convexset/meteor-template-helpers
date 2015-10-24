// Not
UI.registerHelper('not', function is_not(x) {
	return !x;
});

// Ternary
UI.registerHelper('ternary', function ternary(x, a, b) {
	return !!x ? a : b;
});
