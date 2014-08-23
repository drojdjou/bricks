var list = EXT.select('section');

var slides = EXT.selectAll('.slide');
slides.forEach(function(e) {
	e.ext.css('height', window.innerHeight + 'px');
});

var targetY = 0, stepY = 0, currentY = 0, ease = 0.1;
var listHeight = list.ext.rect().height;
var stepHeight = listHeight/slides.length;

var isTouch = 'ontouchstart' in document;

var snapTimeoutLimit = isTouch ? 100 : 500, snapTimeout;

console.log(listHeight + " / 7 = " + stepHeight + " | " + window.innerHeight);

document.addEventListener('touchmove', function(e) { 
    e.preventDefault(); 
});

VirtualScroll.options({
    keyStep: (window.innerHeight * 0.5) + 1,
    mouseMult: 0.33
});

VirtualScroll.on(function(e) {
	targetY += e.deltaY;
    targetY = Math.max( (listHeight - window.innerHeight) * -1, targetY);
    targetY = Math.min(0, targetY);

    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(snap, snapTimeoutLimit);
});


var snap = function() {
    targetY = Math.round(targetY / stepHeight) * stepHeight;
};

var run = function() {
	requestAnimationFrame(run);
	currentY += (targetY - currentY) * ease;
    var t = 'translateY(' + currentY + 'px) translateZ(0)';
    var s = list.style;
    s["transform"] = t;
    s["webkitTransform"] = t;
    s["mozTransform"] = t;
    s["msTransform"] = t;
};

run();