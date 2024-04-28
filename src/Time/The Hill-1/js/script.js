var _instance;
class Plane {
	constructor() {
		this.uniforms = {
			time: {
				type: 'f',
				value: 0
			},
			ucolor: {
				type: 'v3',
				value: new THREE.Vector3(1., 1., 1.)
			},
			uopacity: {
				type: 'f',
				value: 1.0
			}
		};
		this.mesh = this.createMesh();
		this.time = 1;
		_instance = this;
	}
	createMesh() {
		return new THREE.Mesh(
			new THREE.PlaneGeometry(256, 256, 256, 256),
			new THREE.RawShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: "#define GLSLIFY 1\nattribute vec3 position;\n\nuniform mat4 projectionMatrix;\nuniform mat4 modelViewMatrix;\nuniform float time;\n\nvarying vec3 vPosition;\n\nmat4 rotateMatrixX(float radian) {\n  return mat4(\n    1.0, 0.0, 0.0, 0.0,\n    0.0, cos(radian), -sin(radian), 0.0,\n    0.0, sin(radian), cos(radian), 0.0,\n    0.0, 0.0, 0.0, 1.0\n  );\n}\n\n//\n// GLSL textureless classic 3D noise \"cnoise\",\n// with an RSL-style periodic variant \"pnoise\".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-10-11\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x)\n{\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise(vec3 P)\n{\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod289(Pi0);\n  Pi1 = mod289(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute(permute(ix) + iy);\n  vec4 ixy0 = permute(ixy + iz0);\n  vec4 ixy1 = permute(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\nvoid main(void) {\n  vec3 updatePosition = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz;\n  float sin1 = sin(radians(updatePosition.x / 128.0 * 90.0));\n  vec3 noisePosition = updatePosition + vec3(0.0, 0.0, time * -30.0);\n  float noise1 = cnoise(noisePosition * 0.08);\n  float noise2 = cnoise(noisePosition * 0.06);\n  float noise3 = cnoise(noisePosition * 0.4);\n  vec3 lastPosition = updatePosition + vec3(0.0,\n    noise1 * sin1 * 8.0\n    + noise2 * sin1 * 8.0\n    + noise3 * (abs(sin1) * 2.0 + 0.5)\n    + pow(sin1, 2.0) * 40.0, 0.0);\n\n  vPosition = lastPosition;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPosition, 1.0);\n}\n",
				fragmentShader: "precision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPosition;\n\nuniform vec3 ucolor;\n\nuniform float uopacity;\n\nvoid main(void) {\n  float opacity = (96.0 - length(vPosition)) / 256.0 * 0.6;\n gl_FragColor = vec4(ucolor, opacity*uopacity);\n}\n",
				transparent: true
			})
		);
	}
	render(time) {
		this.uniforms.time.value += time * this.time;
	}
}

const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
	antialias: false,
	canvas: canvas,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
const clock = new THREE.Clock();

const plane = new Plane();

const resizeWindow = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
const on = () => {
	$(window).on('resize', () => {
		resizeWindow();
	});
}
const render = () => {
	plane.render(clock.getDelta());
	renderer.render(scene, camera);
}
let raf;
const renderLoop = () => {
	render();
	raf = requestAnimationFrame(renderLoop);
}

//lively stuffs

let noClock = false;
let _12hour = true;
let noDate = false;
let mmddyy = true;

const dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


let background = "#0E0E0E";
const init = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(parseInt(background.replace('#', '0x')), 1.0);
	camera.position.set(0, 16, 128);
	camera.lookAt(new THREE.Vector3(0, 28, 0));

	while (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
	if (raf) {
		cancelAnimationFrame(raf);
	}
	scene.add(plane.mesh);
	on();
	resizeWindow();
	renderLoop();
}
init();

window.onresize = e => {
	clockPos();
}

function clockPos() {
	const clockEl = document.querySelector('.p-summary');
	clockEl.style.left = window.innerWidth / 2 - clockEl.clientWidth / 2 + "px";
}

function UpdateClock() {
	const time = new Date();

	let timeEl = document.getElementById('clock');
	let dateEl = document.getElementById('date');
	let dayEl = document.getElementById('day');

	/*
	if(noDate && noClock){
	  dateEl.style.display="none";
	  dayEl.style.display="none";
	  timeEl.style.display="none";
	  return
	}
	*/

	if (noClock)
		timeEl.style.display = "none";
	else
		timeEl.style.display = "block";

	if (noDate) {
		dateEl.style.display = "none";
		dayEl.style.display = "none";
	} else {
		dateEl.style.display = "block";
		dayEl.style.display = "block";
	}

	let d = new Date();

	if (_12hour)
		timeEl.innerHTML = `- ${new Intl.DateTimeFormat('en-US',{'hour':'2-digit','minute':'2-digit','hour12':true}).format(d)} -`.replace("AM", '').replace("PM", '');
	else
		timeEl.innerHTML = `- ${new Intl.DateTimeFormat('en-US',{'hour':'2-digit','minute':'2-digit','hour12':false}).format(d)} -`;

	if (mmddyy)
		dateEl.innerText = new Intl.DateTimeFormat('en-US', {
			'month': 'short',
			'day': '2-digit',
			'year': '2-digit'
		}).format(d).replace(',', '');
	else
		dateEl.innerText = new Intl.DateTimeFormat('en-GB', {
			'day': '2-digit',
			'month': '2-digit',
			'year': '2-digit'
		}).format(d).replace(',', '');

	dayEl.innerText = dayArr[d.getDay()];

	setTimeout(UpdateClock, 1000);
}
UpdateClock();
clockPos();

function SucrosePropertyListener(name, val) {
	switch (name) {
		case "timeToggle":
			noClock = !val.value;
			break;
		case "dateToggle":
			noDate = !val.value;
			break;
		case "_12hour":
			_12hour = val.value;
			break;
		case "mmddyy":
			mmddyy = !val.value;
			break;
		case "fontColor":
			document.querySelector(".p-summary").style.color = "#" + val.value.substring(3);
			break;
		case "hillColor":
			tmp = hexToRgb(val.value);
			_instance.uniforms.ucolor.value = new THREE.Vector3(tmp.r / 255, tmp.g / 255, tmp.b / 255);
			break;
		case "bgColor":
			background = val.value;
			init();
			break;
		case "hillOpacityFac":
			_instance.uniforms.uopacity.value = val.value / 100;
			break;
	}
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[2], 16),
		g: parseInt(result[3], 16),
		b: parseInt(result[4], 16)
	} : null;
}