/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

/**
*	=====================================================================
*	DISTORTION SHADER : too much drugs
* 	=====================================================================
*/
var DistortionShader = {
	uniforms: {
		tDiffuse: { type: "t", value: null },
		time: { type:"f", value:0},
		amplitude : { type:"f", value: 0.1}
	},

	vertexShader: [
		"uniform float time;",
		"uniform float amplitude;",

		"void main() {",
			"vec3 distance = ((cos(position.x + time) + 1.0) / 2.0) * normal;",
			"distance = distance * sin(position.y + time);",
			"vec3 newpos = position + (distance * amplitude);",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( newpos, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

		"void main() {",
			"gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
		"}"

	].join("\n")
};