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
		if (view.name.substring(0, 9) === 'Template.') {
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

	const view = (elem && Blaze.getView(elem)) || instance.view;

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
