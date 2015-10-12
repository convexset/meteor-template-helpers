Package.describe({
	name: 'convexset:template-helpers',
	version: '0.1.0',
	summary: 'Template-level manipulation tools (such as python-style \"enumerate\" for collections and \"logic\").',
	git: 'https://github.com/convexset/meteor-template-helpers',
	documentation: '../../README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.0.2');
	api.use(['ecmascript', 'underscore', 'blaze'], 'client');
	api.addFiles([
		'collection-manipulation.js',
		'order-tools.js',
		'parent-template.js',
	], 'client');
    api.export(['TemplateHelpers'], 'client');
});