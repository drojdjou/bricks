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
uniform sampler2D uRamp;

uniform vec2 uVideoAspect;

               
void main() {

	vec3 lum = vec3(0.299, 0.587, 0.114);

	vec2 aTc = fract(vTexCoord * 2.0);

	aTc.x = (aTc.x / uVideoAspect.x) + (uVideoAspect.x - 1.0) * 0.5;
	aTc.y = (aTc.y / uVideoAspect.y) + (uVideoAspect.y - 1.0) * 0.5;

	vec3 color = texture2D(uTexture, aTc).rgb;
	float greyscale = dot(color.rgb, lum);

	float gc = greyscale;

	//greyscale = 1.0 + (greyscale - 0.5) * 2.0;
	//greyscale = floor(greyscale * 2.0) * 0.5;

	float colArea = step(1.0, vTexCoord.y * 2.0) * 2.0 + step(1.0, vTexCoord.x * 2.0);

	colArea = 0.125 + colArea * 0.25;
	
	vec3 ramp = texture2D(uRamp, vec2(colArea, greyscale)).rgb;

	// color = vec3(0.5) + (color - vec3(0.5)) * 2.0;

	gl_FragColor = vec4(mix(vec3(gc), ramp, 0.5), 1.0);
}
















