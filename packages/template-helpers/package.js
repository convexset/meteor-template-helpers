Package.describe({
	name: 'convexset:template-helpers',
	version: '0.1.16_1',
	summary: 'Template-level manipulation tools (such as python-style \"enumerate\" for collections and \"logic\").',
	git: 'https://github.com/convexset/meteor-template-helpers',
	documentation: '../../README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.0.2');
	api.use([
		'ecmascript', 'underscore', 'blaze', 'ejson',
		'jparker:crypto-core@0.1.0',
		'jparker:crypto-sha1@0.1.0',
	], 'client');
	api.addFiles([
		'collection-manipulation.js',
		'order-tools.js',
		'logic.js',
		'template-extensions.js',
	], 'client');
	api.export(['TemplateHelpers'], 'client');
});

Package.onTest(function(api) {
	api.use(['tinytest', 'test-helpers'], 'client');
	api.use([
		'ecmascript', 'mongo', 'tracker', 'underscore', 'jquery',
		'templating', 'spacebars',
		'convexset:template-helpers'
	], 'client');
	api.addFiles(['tests/tests.html'], 'client');
	api.addFiles(['tests/tests.js'], 'client');
});