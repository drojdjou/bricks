var APP_VERSION = '1.0 build 24'

var isTouch = ('ontouchstart' in document);
var CLICK = isTouch ? 'touchstart' : 'click';
var saveFileName = 'webgram-photo.png';
var savingEnabled = true;

var canvas = document.querySelector('#gl-canvas');
var frame = document.querySelector('.photo-frame');


var info = document.querySelector('.info');
var shutterSound = document.querySelector('#shutter');

var wand = document.querySelector('.wand');
var snap = document.querySelector('.snap');
var swapcam = document.querySelector('.swapcam');

var gl = new GL(canvas);
var stream = new UserStream();
var resolution = isTouch ? 2 : 1;
var paused = false;

var setInfo = function(m) {
	info.innerHTML = m;
}

document.addEventListener('touchmove', function(e) {
	e.preventDefault();
});

var resize = function() {

	var w = window.innerWidth, h = window.innerHeight;
	var minVerticalLayout = 600;
	var menuSize = 150;
	var cw, ch, ml = 0;

	if(w < h) {
		// console.log("Vertical/portrait mode");
		cw = w;
		ch = w;
	} else if(h < w && h < minVerticalLayout) {
		// console.log("Landscape mode");
		cw = h;
		ch = h;
	} else {
		// console.log("Wide screen mode");
		ml = (w - (h - menuSize)) * 0.5;
		cw = h - menuSize;
		ch = h - menuSize;
	}

	canvas.style.marginLeft = ml + 'px';
	canvas.width = cw * resolution;
	canvas.height = ch * resolution;

	frame.style.width =  cw + 'px';
	frame.style.height = ch + 'px';

	if(resolution != 1) {
		var scale = 1 / resolution;
		canvas.style.webkitTransformOrigin = '0 0';
		canvas.style.webkitTransform = 'scale(' + scale + ', ' + scale + ')';
	}

	// console.log('size', canvas.width, canvas.height);
	gl.resize(canvas.width, canvas.height);
}

var run = function() {
	requestAnimationFrame(run);
	if(!paused) gl.render();
}

var savePhoto = function() {
	paused = true;

	shutterSound.play();
	frame.setAttribute('class', 'photo-frame-active');

	setTimeout(function() {

		if(savingEnabled) {
			var b64 = canvas.toDataURL();
			var link = document.createElement('a');
			link.setAttribute('download', saveFileName);
			link.setAttribute('href', b64);
			link.setAttribute('target', '_blank');
			link.click();
			setInfo('Saving ' + saveFileName);
		}

		setTimeout(function() { 
			
			paused = false; 
		}, 500);

		frame.setAttribute('class', 'photo-frame');

	}, 10);
}

var shaders = [
	'halftone',
	'color-halftone',
	'popart',
	'zoomblur'
];

var currentShader = 0;

var changeEffect = function() {
	currentShader++;
	if(currentShader >= shaders.length) currentShader = 0;
	gl.setShader(shaders[currentShader]);
};

var changeCamera = function() {
	gl.cancelVideoTexture();
	stream.getNextMedia(gl.setVideoTexture);
}

snap.addEventListener(CLICK, savePhoto);
wand.addEventListener(CLICK, changeEffect);
swapcam.addEventListener(CLICK, changeCamera);

// === === === === === === === === === === 

window.addEventListener('resize', resize);
resize();

gl.setShader(shaders[currentShader]);

gl.setGeometry();
gl.loadRamp();
stream.getNextMedia(gl.setVideoTexture);

run();













