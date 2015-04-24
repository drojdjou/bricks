module([
	'lib/Lib', 
	'lib/ThirdParty',
	'http://bartekdrozdz.com/src/framework/Version',
	'BModule'
], function(r) {

	console.log('AModule.constructor');
	var a = 0, b = 0;

	var div = document.querySelector('.some-div');
	var lib = r('lib/Lib');

	r('lib/ThirdParty')(); // <- only if object defined global var with the same name as the file (minus .js)
	ThirdParty(); // <- otherwise work with globals like this
	console.log('	build', Framework.build); // <- ... or this
	console.log('	div', div);

	return {
		run: function() {
			b++;
			console.log('AModule.run');
			console.log('	a + b = ' + lib.add(a, b));
		}
	}
});



