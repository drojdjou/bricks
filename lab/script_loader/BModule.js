module(['lib/Lib'], function(r) {

	console.log('BModule.constructor');
	console.log('	' + r('lib/Lib').color());

	return {
		run: function() {
			console.log('BModule.run');
		}
	}
});