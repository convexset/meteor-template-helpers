// Get the parent template instance
// @param {Number} [levels] How many levels to go up. Default is 1
// @returns {Blaze.TemplateInstance}
//
// Stolen from: http://stackoverflow.com/questions/27949407/how-to-get-the-parent-template-instance-of-the-current-template/27962713#27962713
Blaze.TemplateInstance.prototype.parentTemplate = function(levels) {
	var view = Blaze.currentView || this.view;
	if (typeof levels === "undefined") {
		levels = 1;
	}
	while (view) {
		if (view.name.substring(0, 9) === "Template." && !(levels--)) {
			return view.templateInstance();
		}
		view = view.parentView;
	}
};
