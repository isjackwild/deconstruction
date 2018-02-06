import * as dat from 'dat-gui';
import MobileDetect from 'mobile-detect';
import { init as initLoop, renderer, onResize as onResizeRenderer } from './experience/loop.js';
import { onResize as onResizeCamera } from './experience/camera.js';
import { updateText } from './experience/scene.js';
import _ from 'lodash';

window.app = window.app || {};
let currentSearch = '';

const onFocusSearch = () => {
	document.querySelector('.search__text').innerHTML = '';
	document.querySelector('.search').classList.remove('search--yet-to-interact');
};

const onBlurSearch = () => {
	console.log('blur');
	setTimeout(() => {
		if (currentSearch) document.querySelector('.search__text').innerHTML = currentSearch;
	}, 0);
};

const onChangeSearch = (e) => {
	if (e.key.toLowerCase() === 'enter') {
		e.preventDefault();
		return onClickSearch();
	}
	console.log('change');
	setTimeout(() => {
		currentSearch = document.querySelector('.search__text').innerHTML;
	}, 0);
};

const kickIt = () => {
	if (window.location.search.indexOf('debug') > -1) app.debug = true;
	const md = new MobileDetect(window.navigator.userAgent);
	window.mobile = md.mobile() ? true : false;
	if (window.mobile) document.body.classList.add('mobile');

	// window.gui = new dat.GUI();

	addEventListeners();
	onResize();
	initLoop();
	
	currentSearch = document.querySelector('.search__text').innerHTML;
	document.querySelector('.search__submit').addEventListener('click', onClickSearch);
	document.querySelector('.search__text').addEventListener('focus', onFocusSearch);
	document.querySelector('.search__text').addEventListener('blur', onBlurSearch);
	document.querySelector('.search__text').addEventListener('keydown', onChangeSearch);

	onClickSearch(null, 'deconstruction');
};


const onClickSearch = (e, searchText) => {
	console.log('on click search');
	// if (!searchText) searchText = document.querySelector('.search__text').textContent;
	const _searchText = searchText || currentSearch || '';
	console.log(searchText, currentSearch, _searchText);
	const url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=${encodeURIComponent(_searchText.toLowerCase())}&origin=*`;
	// const url = "https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=Belgium&limit=5";
	fetch(url).then(res => {
		if (res.status !== 200) return console.log('error', res.status);
		return res.json();
	}).then(data => {
		console.log(data);

		const strip = (html) => {
			const tmp = document.createElement('DIV');
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || '';
		};
		if (data.error) return responsiveVoice.speak('Sorry, that page does not exist');

		const markup = data.parse.text["*"];
		const cleanMarkup = strip(markup).replace(/(\r\n|\n|\r)/gm," ").replace(/\s\s+/g, ' ');
		console.log(cleanMarkup);
		// responsiveVoice.speak(cleanMarkup);
		updateText(cleanMarkup.substring(0, 2000));
	}).catch(err => console.log(err));
};

// https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Dog&callback=?

const onResize = () => {
	window.app.width = window.innerWidth;
	window.app.height = window.innerHeight;

	onResizeRenderer(window.app.width, window.app.height);
	onResizeCamera(window.app.width, window.app.height);
};

const addEventListeners = () => {
	window.addEventListener('resize', _.throttle(onResize, 16.666));
};


if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', kickIt);
} else {
	window.attachEvent('onload', kickIt);
}

