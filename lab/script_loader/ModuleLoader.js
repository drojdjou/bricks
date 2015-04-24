"use strict";

(function() {

	var scripts = [],
		unprocessedModules = [],
		rawModules = [],
		modules = [], 
		base, appPath, app,
		scriptsToLoad = 0,
		moduleStack = [];

	var module = function(a, b) {
		unprocessedModules.push([a, b]);
	}; 

	var require = function(path) {
		var m = modules[path];

		if(!m) {

			if(moduleStack.indexOf(path) > -1) throw 'Circular reference in: ' + path;

			if(rawModules[path]) {
				moduleStack.push(path);
				var r = rawModules[path];
				if(r instanceof Function) r = r(require, create); 
				m = modules[path] = r;
				if(!m) console.warn('Module does not return an object in: ' + path)
				moduleStack.pop();
			} else {
				throw 'Missing require: ' + path;
			}
		}

		return m;
	};

	var create = function(path) {
		return new (require(path))();
	}

	var onLoad = function(e) {
		var m = e.target.__moduleName;
		var md = unprocessedModules.pop();

		if(md) {
			var a = md[0], b = md[1];

			b = b || a;
			
			if(!b || b instanceof Array) throw 'Module definition not found in ' + m;

			if(m == appPath) app = b;
			rawModules[m] = b;

			scriptsToLoad--;

			if(a instanceof Array) {
				a.forEach(function(path) {
					if(path == m) console.warn('Ignoring self import in ' + m);
					else if(!rawModules[path]) load(path);
				});
			}
		} 

		if(!rawModules[m]) {
			modules[m] = window[m.split('/').pop()] || true;
			scriptsToLoad--;
		}

		if(scriptsToLoad == 0) app(require, create);
	}

	var load = function(path) {
		if(scripts[path]) return;
		scriptsToLoad += 1;
		var s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.addEventListener('load', onLoad);
		s.__moduleName = path;
		document.body.appendChild(s);
		s.src = base + path + '.js';
		scripts[path] = s;
	};

	window.module = module;
	var scriptTags = Array.prototype.slice.call(document.querySelectorAll('script'));
	var mlScript = scriptTags[scriptTags.length - 1];
	base = mlScript.getAttribute('base') || '';
	appPath = mlScript.getAttribute('app');
	if(!appPath) throw 'ModuleLoader is missing "app" attribute';
	else load(appPath);

})();