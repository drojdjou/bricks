(function() {

	var rawModules = [],
		modules = [];

	window.module = function() {
		// TODO finish this
		var l = arguments.length;
		var a = (l == 3) ? arguments[2] : arguments[1];
		var a = (l == 2) arguments[1];
		rawModules[a] = b;
	}; 

	var require = function(path) {
		var m = modules[path];
		if(!m) m = modules[path] = rawModules[path](require);
		return m;
	};

})();

// ------------------ ------------------- ------------------

module(['Lib'], function() {

	console.log('AModule loaded');
	var a = 0, b = 0;

	var lib = require('Lib');

	return {
		run() {
			b++;
			console.log('AModule run', lib.add(a, b));
		}
	}
}, 'AModule');

module([], function() {

	console.log('Lib loaded');

	return {

		color: function() { return '#ff0000'; },
		add: function(a, b)  { return a + b; },
		name: function() { return 'the name of the lib'; }

	}

}, 'Lib');

module(['Lib'], function() {

	var lib = require('Lib');
	console.log('BModule loaded', lib.color());

	return {
		run() {
			console.log('BModule run');
		}
	}
}, 'BModule');

module(['AModule', 'BModule'], function() {

	var a = require('AModule');
	var b = require('BModule');
	var l = require('Lib');

	console.log('app: ', l.name());
	a.run();
	b.run();
}, 'app');

// ------------------ ------------------- ------------------

require('app');