import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, SphereGeometry, ShaderMaterial, Color, DoubleSide } from 'three';
import { camera } from './camera.js';
import { intersectableObjects } from './input-handler.js';
import { lights } from './lighting.js';
import TextParticles from './TextParticles';

export let scene, boxMesh, textParticles, skybox;
const LOREM = "non gravida tellus ullamcorper non. Cras vulputate vestibulum diam vel euismod. Morbi non nibh quam. Nunc mi justo, interdum sed egestas vitae, molestie vel ex. Pellentesque scelerisque sagittis tellus, eu tempor mi hendrerit in. Vivamus tincidunt cursus urna. Proin ut nisl eu magna dapibus suscipit ut sodales tortor. Praesent pharetra, metus a tincidunt varius, mauris diam efficitur augue, eget malesuada dolor purus non enim. Curabitur interdum lorem et nulla porta, eu hendrerit turpis dictum. Quisque vel euismod dolor, sit amet porttitor nisl. Donec eu auctor urna. Aenean vehicula dui vitae nibh iaculis facilisis. Sed eleifend nibh a turpis sagittis, vel auctor erat convallis. Pellentesque porttitor neque sit amet arcu bibendum tempus. Etiam consequat purus magna. Maecenas sollicitudin neque eget molestie volutpat. Ut at tellus arcu. Nam rhoncus tincidunt semper. Vivamus id lacinia est. Fusce feugiat ipsum nec aliquam fringilla. Integer in ornare sapien, nec dapibus libero. Nunc at eleifend tortor, sit amet porta erat. Pellentesque ornare, dolor vitae semper iaculis, erat enim dapibus est, in fermentum magna enim ac sem. Proin quis tempor justo. Sed sed tristique nunc. Mauris elementum nisi in volutpat ultrices. Duis vel nisl lectus. Sed congue eros ac blandit venenatis. In lacinia dui nisl, non porttitor purus suscipit et. Nam varius sem ut odio placerat mattis. Cras consectetur arcu at felis scelerisque tincidunt."

export const init = () => {
	scene = new Scene();
	scene.add(camera);
	lights.forEach( light => scene.add(light) );

	const boxGeometry = new BoxGeometry( 50, 50, 50 );
	const boxMaterial = new MeshBasicMaterial( { color: 0x0000ff } );
	boxMesh = new Mesh( boxGeometry, boxMaterial );
	// scene.add( boxMesh );

	// textParticles = TextParticles(LOREM);
	// scene.add(textParticles.mesh);

	const uniforms = {
      color1: {
        type: "c",
        value: new Color(0xd41758),
      },
      color2: {
        type: "c",
        value: new Color(0xa6be6d),
        // value: new Color(0xbe646d),
      },
    };
    // a32f59
    // 
    // a32f59
    const fragmentShader = `
    	uniform vec3 color1;
		uniform vec3 color2;
		varying vec2 vUv;

		void main() {
			// gl_FragColor = vec4(mix(color1, color2, (cos(vUv.y * (3.14 * 2.0))) + 1.0) * 0.5, 1.0);
			// gl_FragColor = vec4(color1, 1.0);
			float TWO_PI = 3.1416 * 2.0;
			// float mapped = map(vUv.y, 0.2, 0.8, 0.0, 1.0);
			float stretchedUV = clamp((vUv.y * 2.0) - 1.0, 0.0, 1.0); 
			float control = (cos(stretchedUV * TWO_PI) + 1.0) * 0.5;
			// float control = 1.0;
			gl_FragColor = vec4(mix(color2, color1, vUv.y), 1.0);
		}
    `;

    const vertexShader = `
    	varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
		}
    `;
    const geom = new SphereGeometry(10000, 36, 36);
    geom.rotateZ(0.2);
	skybox = new Mesh(
		geom,
		new ShaderMaterial({
			side: DoubleSide,
			uniforms,
			fragmentShader,
			vertexShader,
		}),
	);
	skybox.material.fog = false;
	scene.add(skybox);
	document.querySelector('.texture').classList.add('texture--visible')
};

export const updateText = (newText) => {
	if (textParticles) scene.remove(textParticles.mesh);
	textParticles = undefined;
	textParticles = TextParticles(newText);
	scene.add(textParticles.mesh);
};

export const update = (delta) => {
	if (textParticles) textParticles.update(delta);
};
