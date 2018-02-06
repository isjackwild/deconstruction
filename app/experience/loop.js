const THREE = require('three');
import { init as initScene, update as updateScene, scene } from './scene.js';
import { init as initCamera, camera, update as updateCamera } from './camera.js';
import { init as initControls, update as updateControls, controls } from './controls.js';
import { init as initInput } from './input-handler.js';
import Stats from 'stats-js';

let canvas;
let raf, then, now, delta, stats, isAnimating;
let currentCamera, currentScene;
export let renderer;

export const init = () => {
	canvas = document.getElementsByClassName('canvas')[0];
	setupRenderer();
	initCamera();
	initControls();
	initScene();

	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms 
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	// document.body.appendChild(stats.domElement);
	// initInput();

	window.addEventListener('focus', onFocus);
	window.addEventListener('blur', onBlur);

	currentCamera = camera;
	currentScene = scene;
	now = new Date().getTime();
	if (!isAnimating) animate();
}

const onFocus = () => {
	delta = 1;
	then = null;
	now = new Date().getTime();
	if (!isAnimating) animate();
}

const onBlur = () => {
	cancelAnimationFrame(raf);
	isAnimating = false;
	then = null;
	delta = 1;
}

export const kill = () => {
	cancelAnimationFrame(raf);
}

const setupRenderer = () => {
	renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
	});
	renderer.setClearColor(0x000000);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

export const onResize = (w, h) => {
	if (canvas) canvas.width = null;
	if (canvas) canvas.height = null;
	if (canvas) canvas.style.width = null;
	if (canvas) canvas.style.height = null;
	setTimeout(() => {
		if (renderer) renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	}, 0);
}

const update = (delta) => {
	updateScene(delta);
	updateControls(delta);
	updateCamera(delta);
}

const render = () => {
	renderer.render(currentScene, currentCamera);
}

const animate = () => {
	isAnimating = true;
	stats.begin();
	then = now ? now : null;
	now = new Date().getTime();
	delta = then ? (now - then) / 16.666 : 1;

	update(delta);
	render();
	stats.end();

	raf = requestAnimationFrame(animate);
}
