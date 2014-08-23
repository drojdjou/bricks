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

uniform sampler2D texture;
const vec2 center = vec2(0.5, 0.5);
const float angle = 0.70;
const float scale = 3.0;

float pattern(vec2 uv, float angle) {
	float s = sin(angle), c = cos(angle);
	vec2 tex = (uv - center) * 90.0;
	vec2 point = vec2(
		c * tex.x - s * tex.y,
		s * tex.x + c * tex.y
	) * scale;

	return (sin(point.x) * sin(point.y)) * 4.0;

}

vec2 clampUV(vec2 uv, vec2 aspect) {
	vec2 cuv;
	cuv.x = (uv.x / aspect.x) + (aspect.x - 1.0) * 0.5;
	cuv.y = (uv.y / aspect.y) + (aspect.y - 1.0) * 0.5;
	return cuv;
}
               
void main() {

	vec2 uv = clampUV(vTexCoord, uVideoAspect);

	vec4 color = texture2D(uTexture, uv);
	vec3 cmy = 1.0 - color.rgb;
	float k = min(cmy.x, min(cmy.y, cmy.z));
	cmy = (cmy - k) / (1.0 - k);
	cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(uv, angle + 0.26179), pattern(uv, angle + 1.30899), pattern(uv, angle)), 0.0, 1.0);
	k = clamp(k * 10.0 - 5.0 + pattern(uv, angle + 0.78539), 0.0, 1.0);
	gl_FragColor = vec4(1.0 - cmy - k, 1.0);

}
















