const THREE = require('three');
import _ from 'lodash';

const createMap = (letters) => {
	const LETTER_BOUNDING_BOX = window.mobile ? 80 : 200;

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	canvas.style.width = '300px';
	canvas.style.height = '300px';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.position = 'absolute';
	canvas.style.opacity = 1;
	canvas.style.zIndex = 200;
	canvas.style.backgroundColor = 'orange';

	const ceilSqRt = Math.ceil(Math.sqrt(letters.length));

	canvas.width = canvas.height = LETTER_BOUNDING_BOX * ceilSqRt;
	context.font = `${LETTER_BOUNDING_BOX - 1}px serif`;
	context.fillStyle = "#ffffff";
	context.strokeStyle = "#ffffff";
	// context.font = "35pt bold arial";
	context.textBaseline = 'middle';
	context.textAlign = 'center';

	let i = 0;
	while (letters.length) {
		const x = ((i % ceilSqRt) * LETTER_BOUNDING_BOX) + (LETTER_BOUNDING_BOX * 0.5);
		const y = (LETTER_BOUNDING_BOX * ceilSqRt) - ((~~ (i / ceilSqRt)) * LETTER_BOUNDING_BOX) + (LETTER_BOUNDING_BOX * 0.5);

		const letter = letters.pop();

		context.fillText(letter, x, y);
		// context.fillRect(x - (LETTER_BOUNDING_BOX * 0.5), y - (LETTER_BOUNDING_BOX * 0.5), LETTER_BOUNDING_BOX, LETTER_BOUNDING_BOX);
		i++;
	}

	const texture = new THREE.CanvasTexture(canvas);
	return texture;
};

export default createMap;
