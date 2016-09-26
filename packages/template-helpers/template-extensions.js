// Get the parent template instance
// @param {Number} [levels] How many levels to go up. Default is 1
// @returns {Blaze.TemplateInstance}

Blaze.TemplateInstance.prototype.parentTemplate = function(levels, show_trace) {
	// Blaze.currentView is not usable, otherwise xxx.parentTemplate().parentTemplate() fails
	var view = this.view;
	if (typeof levels === "undefined") {
		levels = 1;
	}

	if (!view) {
		return null;
	}
	var init_view_name = view.name;

	while (!!view.parentView) {
		if (!!show_trace) {
			console.log(init_view_name, '-->', view.name, 'at level', levels);
		}
		if (view.name.substring(0, 9) === "Template.") {
			levels -= 1;
			if (levels < 0) {
				if (!!show_trace) {
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
	var instance = this;

	const fn = (typeof fnOrFuncAndElem === 'function') ? fnOrFuncAndElem : fnOrFuncAndElem.func;
	const elem = (typeof fnOrFuncAndElem === 'function') ? null : instance.$(fnOrFuncAndElem.elemOrSelector)[0];

	const view = (elem && Blaze.getView(elem)) || instance.view;

	return Blaze._withCurrentView(view, () => {
		var currTemplateInstanceFunc = Template._currentTemplateInstanceFunc;
		Template._currentTemplateInstanceFunc = () => instance;
		var result = fn.apply((!!context) ? context : instance, args);
		Template._currentTemplateInstanceFunc = currTemplateInstanceFunc;
		return result;
	});
};