var info = document.querySelector('p');
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var w = window.innerWidth;
var h = window.innerHeight;

canvas.width = w;
canvas.height = h;

context.fillStyle = '#f00';
context.beginPath();
context.arc(w/2, h/2, w/4, 0, Math.PI * 2);
context.fill();

info.innerHTML += ' | ' + w + ' x ' + h; 

console.log('does this even get executed?');