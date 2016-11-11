import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

const _ = require('underscore');

/* eslint-disable no-console */

// Get the parent template instance
// @param {Number} [levels] How many levels to go up. Default is 1
// @returns {Blaze.TemplateInstance}

Blaze.TemplateInstance.prototype.parentTemplate = function(levels = 1, showTrace) {
	// Blaze.currentView is not usable, otherwise xxx.parentTemplate().parentTemplate() fails
	let view = this.view;
	if (!view) {
		return null;
	}
	const initViewName = view.name;

	while (!!view.parentView) {
		if (!!showTrace) {
			console.log(`${initViewName} --> ${view.name} at level ${levels}`);
		}
		if ((view.name.substring(0, 9) === 'Template.') || (view.name === 'body')) {
			levels -= 1;
			if (levels < 0) {
				if (!!showTrace) {
					console.log('Done');
				}
				return view.templateInstance();
			}
		}
		view = view.parentView;
	}
	return null;
};


// Allow Template.instance() to be accessible and point to template instance
// and call with given context
Blaze.TemplateInstance.prototype.callFunctionWithTemplateContext = function callFunctionWithTemplateContext(fnOrFuncAndElem, context, ...args) {
	return this.applyFunctionWithTemplateContext(fnOrFuncAndElem, context, args);
};

// Allow Template.instance() to be accessible and point to template instance
// and apply with given context
Blaze.TemplateInstance.prototype.applyFunctionWithTemplateContext = function applyFunctionWithTemplateContext(fnOrFuncAndElem, context, args) {
	const instance = this;

	const fn = _.isFunction(fnOrFuncAndElem) ? fnOrFuncAndElem : fnOrFuncAndElem.func;
	const elem = _.isFunction(fnOrFuncAndElem) ? null : instance.$(fnOrFuncAndElem.elemOrSelector)[0];

	const getDefaultView = () => {
		const hasAncestorView = !!Blaze.currentView && Blaze.currentView._hasAncestorView(this.view);
		return hasAncestorView ? Blaze.currentView : this.view;
	};
	const view = (elem && Blaze.getView(elem)) || getDefaultView();

	return Blaze._withCurrentView(view, () => {
		const currTemplateInstanceFunc = Template._currentTemplateInstanceFunc;
		Template._currentTemplateInstanceFunc = () => instance;

		let result;
		try {
			result = fn.apply(!!context ? context : instance, args);
		} finally {
			Template._currentTemplateInstanceFunc = currTemplateInstanceFunc;
		}
		return result;
	});
};

Object.defineProperty(Blaze.View.prototype, '_isTemplateView', {
	get: function getIsTemplateView() {
		return this._templateInstance && ((this.name === 'body') || (this.name.split('.')[0] === 'Template'));
	}
});

Object.defineProperty(Blaze.View.prototype, '_closestAncestorWithTemplate', {
	get: function getClosestTemplateAncestor() {
		let current = this;
		while (!!current.parentView && !current._isTemplateView) {
			current = current.parentView;
		}
		return current._isTemplateView ? current : null;
	}
});

Object.defineProperty(Blaze.View.prototype, '_closestAncestorWithTemplate_inclAllSorts', {
	get: function getClosestTemplateAncestorInclAllSorts() {
		let current = this;
		while (!!current.parentView && !current._templateInstance) {
			current = current.parentView;
		}
		return current._templateInstance ? current : null;
	}
});

Blaze.View.prototype._hasAncestorView = function _hasAncestorView(view, stopAtTemplates = true) {
	let current = this;
	if (current === view) {
		return true;
	}

	while (!!current.parentView && (!stopAtTemplates || !current._isTemplateView)) {
		current = current.parentView;
		if (current === view) {
			return true;
		}
	}
	return false;
};

// Like performs a lookup on the view of the current template (calls functions with arguments if they turn up)
Blaze.TemplateInstance.prototype.lookup = function lookup(symbolName, ...args) {
	return this.applyFunctionWithTemplateContext(() => {
		return Blaze._iterativeLookup(symbolName, {}, ...args);
	});
};


const inScopeWhenMovingUpViewTree = view => !!view.parentView && (!view.parentView.__startsNewLexicalScope || (!!view.parentView.parentView && view.parentView.parentView.__childDoesntStartNewLexicalScope));
const mayMoveUpViewTree = view => !!view.parentView && !view._isTemplateView;

/**
 * @summary Reactively obtains all visible scope variables with respect to the current view. Returns null if there is no current view, and an object with names of scope variables as keys along with the corresponding values (as values).
 * @locus Client
 * @param {Blaze.View|DOMElement} [elemOrView] Optional.  The view or element. Defaults to current view if not specified
 * @returns {Object|null} The current scope as a dictionary (object) or null if there is no current view
 */
Blaze._getScope = function _getScope(elemOrView = null) {
	const view = ((elemOrView instanceof Blaze.View) && elemOrView) || (elemOrView && Blaze.getView(elemOrView)) || Blaze.currentView;
	if (!view) {
		return null;
	}

	let scopeContent = arguments[1];
	if (!scopeContent) {
		scopeContent = {};
	}

	// populate content with scope bindings where available and not shadowed
	Object.keys(view._scopeBindings || {}).forEach(function addToScopeContent(k) {
		if (!scopeContent[k]) {
			scopeContent[k] = view._scopeBindings[k].get();
		}
	});

	// move up view tree; stop at state of new lexical scope
	if (inScopeWhenMovingUpViewTree(view)) {
		return _getScope(view.parentView, scopeContent);
	} else {
		return scopeContent;
	}
};


/**
 * @summary Reactively gets, by name, a value that is scoped to the current template through a #let or #each-in block. Returns null if there is no current view, and undefined if the no such name is in visible in the scope.
 * @locus Client
 * @param {String} [name] The name of the scope variable.
 * @param {Blaze.View|DOMElement} [elemOrView] Optional.  The view or element. Defaults to current view if not specified
 * @returns {value|null|undefined} The value of the named scope variable
 */
Blaze._getScopeVariable = function _getScopeVariable(name, elemOrView = null) {
	const view = ((elemOrView instanceof Blaze.View) && elemOrView) || (elemOrView && Blaze.getView(elemOrView)) || Blaze.currentView;
	if (!view) {
		return null;
	}

	// get if available
	if ((view._scopeBindings || {})[name]) {
		return view._scopeBindings[name].get();
	}

	// move up view tree; stop at state of new lexical scope
	if (inScopeWhenMovingUpViewTree(view)) {
		return _getScopeVariable(name, view.parentView);
	} else {
		return void 0; // forever undefined
	}
};

/**
 * @summary Reactively looks up symbols on view
 * @locus Client
 * @param {String} [name] The name of the scope variable.
 * @param {Object} [options] Members: elemOrView (DOM element or View)
 * @param {args} [arguments] Optional.  additional arguments
 * @returns {value|null|undefined} The value of the item
 */
Blaze._iterativeLookup = function _iterativeLookup(name, { elemOrView, initView, preventScopeLookup } = {}, ...args) {
	const view = ((elemOrView instanceof Blaze.View) && elemOrView) || (elemOrView && Blaze.getView(elemOrView)) || Blaze.currentView;
	if (!view) {
		return null;
	}

	// get if available and not prevented (by passing a lexical scope boundary)
	if (!preventScopeLookup) {
		if ((view._scopeBindings || {})[name]) {
			return view._scopeBindings[name].get();
		}
	}

	// get if available
	const lookupValue = Blaze._withCurrentView(initView || view, () => {
		const itemOrFunction = view.lookup(name);
		let returnValue;
		try {
			// console.error('[Blaze._iterativeLookup] view:', view, '\n - itemOrFunction:', itemOrFunction, '\n - mayMoveUpViewTree(view):', mayMoveUpViewTree(view), '\n - next preventScopeLookup:', preventScopeLookup || !inScopeWhenMovingUpViewTree(view))
			returnValue = _.isFunction(itemOrFunction) ? itemOrFunction.apply(Template.currentData(), args) : itemOrFunction;
			// if (_.isFunction(itemOrFunction) && (args.length > 0)) {
			// 	console.error('[Blaze._iterativeLookup] done:', returnValue)
			// }
		} catch (e) {
			returnValue = void 0;
		}
		return returnValue;
	});
	if ((typeof lookupValue !== 'undefined') && (lookupValue !== null)) {
		return lookupValue;
	}

	// move up view tree; stop at templates
	if (mayMoveUpViewTree(view)) {
		return _iterativeLookup(name, {
			elemOrView: view.parentView,
			initView: initView || view,
			preventScopeLookup: preventScopeLookup || !inScopeWhenMovingUpViewTree(view)
		}, ...args);
	} else {
		return void 0; // forever undefined
	}
};
