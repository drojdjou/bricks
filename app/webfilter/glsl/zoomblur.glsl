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

const vec2 center = vec2(0.5, 0.5);
const float strength = 0.8;

// https://github.com/evanw/glfx.js/blob/master/src/filters/common.js
float random(vec3 scale, float seed) {
	return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

vec2 clampUV(vec2 uv, vec2 aspect) {
	vec2 cuv;
	cuv.x = (uv.x / aspect.x) + (aspect.x - 1.0) * 0.5;
	cuv.y = (uv.y / aspect.y) + (aspect.y - 1.0) * 0.5;
	return cuv;
}

// https://github.com/evanw/glfx.js/blob/master/src/filters/blur/zoomblur.js            
void main() {

	vec2 uv = clampUV(vTexCoord, uVideoAspect);

	vec4 color = vec4(0.0);
	float total = 0.0;

	vec2 toCenter = center - vTexCoord;
	float centerDist = length(toCenter);
	// centerDist = step(0.2, centerDist);

	float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);

	for (float t = 0.0; t <= 20.0; t++) {
	    float percent = (t + offset) / 20.0;
	    float weight = 4.0 * (percent - percent * percent);
	    vec4 sample = texture2D(uTexture, uv + (toCenter * percent * strength) * centerDist);
	    color += sample * weight;
	    total += weight;
	}

	color = color / total;

	color.rgb = vec3(0.5) + (color.rgb - vec3(0.5)) * 1.5;

	gl_FragColor = color;
}
















