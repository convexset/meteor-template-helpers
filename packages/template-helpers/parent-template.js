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