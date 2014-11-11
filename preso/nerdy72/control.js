var total =  Array.prototype.slice.call(document.querySelectorAll('article'), 0).length;
var current = 1;

Util = {

	fullbleed: function(element) {
		var isVideo = element.videoWidth > 0;



		var sw = window.innerWidth,
			sh = window.innerHeight,
			vw = isVideo ? element.videoWidth : element.width,
			vh = isVideo ? element.videoHeight : element.height;

		var sa = sw / sh;
		var va = vw / vh;

		var vx, vy, vcw, vch;

		// large aspect = wide screen, small aspect = tall screen
		// element aspect < screen aspect = height needs overflow
		// element apsect > screen aspect = width needs overflow

		if(va < sa) {
			vx = 0;
			vcw = sw;
			vch = vh / vw * sw;
			vy = (vch - sh) * -0.5;
		} else if(va > sa) {
			vy = 0;
			vch = sh;
			vcw = vw / vh * sh;
			vx = (vcw - sw) * -0.5;
		} else {
			vx = vy = 0, vcw = sw, vch = sh;
		}

		return [vx, vy, vcw, vch];
	}
};

var KEYS = {
	LEFT: 37, 
	UP: 38, 
	RIGHT: 39, 
	DOWN: 40,
	SPACE: 32
};

document.querySelector('.next').addEventListener('click', function() {
	console.log(current, total);
	if(current == total) return;
	unload();
	current += 1;
	current = Math.min(current, total);
	load();
});

document.querySelector('.prev').addEventListener('click', function() {
	if(current == 1) return;
	unload();
	current -= 1;
	current = Math.max(current, 1);
	load();
});

var unload = function() {
	var c = document.querySelector('article:nth-of-type(' + current + ')');
	if(sources[current-1].iframe) c.querySelector('iframe').src = '';
	if(sources[current-1].video) c.querySelector('video').src = '';

	if(sources[current-1].image) {
		var i = c.querySelector('.full') || c.querySelector('.centered');
		if(!i) return;
		i.style.backgroundImage = 'none';
	}

	c.style.display = 'none';
}

var load = function() {
	var c = document.querySelector('article:nth-of-type(' + current + ')');
	if(sources[current-1].iframe) c.querySelector('iframe').src = sources[current-1].iframe;

	if(sources[current-1].video) {
		var v = c.querySelector('video');
		v.src = sources[current-1].video;
		v.autoplay = true;
		v.addEventListener('canplaythrough', function() {
			var r = Util.fullbleed(v);
			v.style.width = r[2] + 'px';
			v.style.height = r[3] + 'px';
			v.style.left = r[0] + 'px';
			v.style.top = r[1] + 'px';
		});
	}

	if(sources[current-1].image) {
		var i = c.querySelector('.full') || c.querySelector('.centered');
		if(!i) return;
		i.style.backgroundImage = 'url(' + sources[current-1].image + ')';
	}

	c.style.display = 'block';
}

load();
