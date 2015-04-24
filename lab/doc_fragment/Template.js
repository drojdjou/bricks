var Template = function(path) {

	var that = this;

	this.content;

	var selectorCache = {};

	this.set = function(content) {
		var df = document.createElement('div');
		df.innerHTML = content;
		that.content = df.firstChild;
		return that;
	}

	this.select = function(sel) {
		if(selectorCache[sel]) {
			return selectorCache[sel];
		} else {
			var e = that.content.querySelector(sel);
			if(!e) throw "Selector not found: " + sel;
			selectorCache[sel] = e;
			return e;
		}
	}

	this.appendTo = function(parent, onAdded) {
		parent.appendChild(that.content);
		if(onAdded) {
			// http://jsfiddle.net/CAewW/2/
			requestAnimationFrame(function() {
				requestAnimationFrame(onAdded);
			});
		}
	}

	this.removeFrom = function(parent, onBeforeRemove) {
		if(onBeforeRemove) {
			onBeforeRemove(function() {
				parent.removeChild(that.content);
			});
		} else {
			parent.removeChild(that.content);
		}
	}

	this.updateText = function(sel, text) {
		that.select(sel).innerHTML = text;
	}

	this.appendText = function(sel, text) {
		that.select(sel).innerHTML += text;
	}

	this.append = function(sel, elem) {
		that.select(sel).appendChild(elem);
	}

	this.clone = function() {

	}

	this.insertList = function(sel, list, template) {
		list.forEach(function(e) {

			if(template) {
				var t = template.content.cloneNode(true);
				t.innerHTML = e;
				that.append(sel, t);
			} else {
				that.appendText(sel, e);
			}
			
		});
	}
}