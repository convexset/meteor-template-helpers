Package.describe({
	// [validatis:stack]
	name: 'convexset:template-helpers',
	version: '0.1.20',
	summary: 'Template-level manipulation tools (such as python-style \"enumerate\" for collections and \"logic\").',
	git: 'https://github.com/convexset/meteor-template-helpers',
	documentation: '../../README.md'
});

Package.onUse(function setup(api) {
	api.versionsFrom('1.2.0.2');
	api.use([
		'ecmascript', 'blaze', 'ejson', 'templating',
		'jparker:crypto-core@0.1.0',
		'jparker:crypto-sha1@0.1.0',
		'tmeasday:check-npm-versions@0.3.1'
	], 'client');

	api.addFiles([
		'order-tools.js',
	], 'client');
	api.addFiles([
		'collection-manipulation.js',
		'logic.js',
		'template-extensions.js',
	], 'client');
	api.export(['TemplateHelpers'], 'client');
});

Package.onTest(function setup(api) {
	api.use(['tinytest', 'test-helpers'], 'client');
	api.use([
		'ecmascript', 'mongo', 'tracker', 'jquery',
		'templating', 'spacebars',
		'convexset:template-helpers'
	], 'client');
	api.addFiles(['tests/tests.html'], 'client');
	api.addFiles(['tests/tests.js'], 'client');
});
