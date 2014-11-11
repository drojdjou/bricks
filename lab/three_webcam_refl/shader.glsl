// shader.glsl
//#vertex

// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat3 normalMatrix;
// uniform vec3 cameraPosition;

// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;
// attribute vec2 uv2;

// #ifdef USE_COLOR
//  	attribute vec3 color;
// #endif

// #ifdef USE_MORPHTARGETS
// 		attribute vec3 morphTarget0;
//		attribute vec3 morphTarget1;
//		attribute vec3 morphTarget2;
//		attribute vec3 morphTarget3;
// #ifdef USE_MORPHNORMALS
//		attribute vec3 morphNormal0;
//		attribute vec3 morphNormal1;
//		attribute vec3 morphNormal2;
//		attribute vec3 morphNormal3;
// #else
//		attribute vec3 morphTarget4;
//		attribute vec3 morphTarget5;
//		attribute vec3 morphTarget6;
//		attribute vec3 morphTarget7;
// #endif
// #endif

// #ifdef USE_SKINNING
//		attribute vec4 skinIndex;
//		attribute vec4 skinWeight;
// #endif

varying vec3 vNormal;
varying vec3 vNormalLoc;
varying vec2 vUV;
varying vec3 vRefVec;
varying vec3 vRetVec;
varying float rfac;

void main()
{
	vNormalLoc = normal;
	vNormal = normalize(normalMatrix * normal);
	vUV = uv;

	vec4 mPosition = modelMatrix * vec4(position, 1.0);
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

	gl_Position = projectionMatrix * mvPosition;

	vec3 incident = normalize(mPosition.xyz - cameraPosition);

	vRetVec = refract(incident, vNormal, 1.0);
	vRefVec = reflect(incident, vNormal);

	// this.dispersionRed = 0.90;
	// 	this.dispersionGreen = 0.97;
	// 	this.dispersionBlue = 1.04;
	// 	this.bias = 0.9
	// 	this.scale = 0.7;
	// 	this.power = 1.1;

	rfac = 0.0 + 0.2 * pow(1.0 + dot(incident, vNormal), 1.2);	

}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265359
#define PI2 6.28318530718

varying vec3 vNormal;
varying vec3 vNormalLoc;
varying vec2 vUV;
varying vec3 vRefVec;
varying vec3 vRetVec;
varying float rfac;


uniform sampler2D uTexture;
   
// // http://en.wikipedia.org/wiki/UV_mapping#Finding_UV_on_a_sphere
    
void main() {

	vec3 d = -vRefVec;
	float u = 0.5 - atan(d.z, d.x) / PI2;
	float v = 0.5 - asin(d.y) / PI;
	vec3 ref = texture2D(uTexture, vec2(u, v)).rgb;

	d = -vRetVec;
	u = 0.5 - atan(d.z, d.x) / PI2;
	v = 0.5 - asin(d.y) / PI;
	vec3 ret = vec3(0.0, 0.0, 0.0);//texture2D(uTexture, vec2(u, v)).rgb;

	vec3 color = ret * rfac + ref * (1.0 - rfac);

	gl_FragColor = vec4(color, 1.0);
}


















