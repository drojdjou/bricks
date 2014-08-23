// shader.glsl
//#vertex
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTexCoord;
     
void main() {
	vTexCoord = aTextureCoord;
	gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec2 vTexCoord;
uniform sampler2D uTexture;

uniform vec2 uVideoAspect;

               
void main() {

	vec2 aTc = vTexCoord;

	float res = 60.0;
	float radius = 0.5;

	aTc.x = aTc.x * res;
	aTc.y = aTc.y * res;

	float fx = fract(aTc.x);
	float fy = fract(aTc.y);

	float lo = 1.0 - step(1.0, fx + fy);

	float dist = length(vec2(fx - 0.5, fy - 0.5));

	aTc.x = floor(aTc.x) / res;
	aTc.y = floor(aTc.y) / res;

	aTc.x = (aTc.x / uVideoAspect.x) + (uVideoAspect.x - 1.0) * 0.5;
	aTc.y = (aTc.y / uVideoAspect.y) + (uVideoAspect.y - 1.0) * 0.5;

	

	vec3 color = texture2D(uTexture, aTc).rgb;

	float greyscale = (color.r + color.g + color.b) * 0.33;

	// color = floor(color * 8.0) * 0.125;

	greyscale *= 1.0 - step(radius * greyscale, dist);

	// color = vec3(0.5) + (color - vec3(0.5)) * 4.0;

	gl_FragColor = vec4(vec3(greyscale), 1.0);
}
















