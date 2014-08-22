var list = EXT.select('.container');

var slides = EXT.selectAll('.slide');
// slides.forEach(function(e) {
// 	e.ext.css('height', window.innerHeight + 'px');
// });

var targetY = 0, stepY = 0, currentY = 0, ease = 0.1;

var isTouch = 'ontouchstart' in document;

var snapTimeoutLimit = isTouch ? 100 : 500, snapTimeout;

var distance = 150;

document.addEventListener('touchmove', function(e) { 
    e.preventDefault(); 
});

VirtualScroll.on(function(e) {
	targetY += e.deltaY * -0.25;
    // clearTimeout(snapTimeout);
    // snapTimeout = setTimeout(snap, snapTimeoutLimit);
});


var snap = function() {
    targetY = Math.round(targetY / stepHeight) * stepHeight;
};

var run = function() {
	requestAnimationFrame(run);
	currentY += (targetY - currentY) * ease;
    var t = ' translatez(' + (-distance) + 'px) rotateX(' + currentY + 'deg)';
    var s = list.style;
    s["transform"] = t;
    s["webkitTransform"] = t;
    s["mozTransform"] = t;
    s["msTransform"] = t;
};

run();