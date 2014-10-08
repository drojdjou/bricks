var Drawable = {

	base: function(drawFunc) {

		var b = {
			x: 0,
			y: 0,
			rotation: 0,
			scaleX: 1,
			scaleY: 1
		};

		b.draw = function(ctx) {
			ctx.save();
			ctx.translate(b.x, b.y);
			ctx.rotate(b.rotation);
			ctx.scale(b.scaleX, b.scaleY);
			drawFunc(ctx);
			ctx.restore();
		}

		return b;
	},

	circle: function(color, radius) {
		return Drawable.base(function(ctx) {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(0, 0, radius, 0, Math.PI * 2);
			ctx.fill();
		});
	},

	rect: function(color, width, height) {
		return Drawable.base(function(ctx) {
			ctx.fillStyle = color;
			ctx.fillRect(width * -0.5, height * -0.5, width, height);
		});
	}

}

