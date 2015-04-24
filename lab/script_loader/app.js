module([
	'AModule', 
	'BModule', 
	'lib/SomeObject',
	'lib/SomeClass',
], function(require, create) {

	console.log('--- app start ---');

	var a = require('AModule');
	var b = require('BModule');

	a.run();
	b.run();

	require('lib/SomeObject').foo();
	create('lib/SomeClass').bar();

	console.log('--- app done ---');
});