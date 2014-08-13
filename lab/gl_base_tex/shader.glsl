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
               
void main() {
	vec3 color = texture2D(uTexture, vTexCoord).rgb;

	float greyscale = (color.r + color.g + color.b) * 0.33;

	gl_FragColor = vec4(greyscale, greyscale, greyscale, 1.0);
}