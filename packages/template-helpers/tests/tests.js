/* global Tinytest: true */

Template.TestHelperTest.onRendered(function() {
	var instance = this;
	Tinytest.add('getProperty', function(test) {
		test.isTrue(_.isEqual(instance.find("#getProperty").innerHTML, 'name'), 'getProperty');
	});

	Tinytest.add('arrayify', function(test) {
		test.equal($("#arrayify>span").length, 5, 'arrayify');
	});
	Tinytest.add('flatten', function(test) {
		test.equal($("#flatten>span").length, 9, 'flatten');
	});
});

Template.TestHelperTest.helpers({
	item: function() {
		return {
			name: 'name',
			id: 'id'
		};
	}
});

Template.TestLevelsInnerInner.onRendered(function() {
	var instance = this;
	var parent_instance = instance.parentTemplate();
	var grandparent_instance = parent_instance.parentTemplate();
	var grandparent_instance_2 = instance.parentTemplate(2);

	Tinytest.add('Parent Template Test ' + instance.data, function(test) {
		test.isTrue(_.isEqual(parent_instance.view.name, 'Template.TestLevelsInner'), 'Parent Name ' + instance.data);
		test.isTrue(_.isEqual(grandparent_instance.view.name, 'Template.TestLevels'), 'Grandparent Name ' + instance.data);
		test.isTrue(_.isEqual(parent_instance.data.value, instance.data), 'Parent Data - ' + instance.data);
		test.isTrue(_.isEqual(grandparent_instance, grandparent_instance_2), 'Instance Consistency ' + instance.data);
	});
});