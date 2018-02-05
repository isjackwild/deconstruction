const THREE = require('three');
export let camera;

const targetRotation = {
	x: 0,
	y: 0,
}

const onMouseMove = ({ clientX, clientY }) => {
	targetRotation.y = 1 - ((clientX / window.innerWidth) - 0.5) * (Math.PI * 0.5);
	targetRotation.x = 1 - ((clientY / window.innerHeight) - 0.5) * (Math.PI * 0.5);
};

export const init = () => {
	camera = new THREE.PerspectiveCamera(45, window.app.width / window.app.height, 1, 10000);
	camera.position.z = 0.1;
	window.addEventListener('mousemove', onMouseMove);
}


export const onResize = (w, h) => {
	if (!camera) return
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}

export const update = (correction) => {
	camera.rotation.x += (targetRotation.x - camera.rotation.x) * 0.01 * correction;
	camera.rotation.y += (targetRotation.y - camera.rotation.y) * 0.01 * correction;
};