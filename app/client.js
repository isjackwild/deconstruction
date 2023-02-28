import * as dat from 'dat-gui';
import MobileDetect from 'mobile-detect';
import { init as initLoop, renderer, onResize as onResizeRenderer } from './experience/loop.js';
import { onResize as onResizeCamera } from './experience/camera.js';
import { updateText } from './experience/scene.js';
import _ from 'lodash';

const DECONSTRUCTION = "Deconstruction is philosopher Jacques Derrida's critique of the relationship between text and meaning. Derrida's approach consists in conducting readings of texts with an ear to what runs counter to the structural unity or intended sense of a particular text. The purpose is to expose that the object of language, and that which any text is founded upon, is irreducibly complex, unstable, or impossible. Throughout his readings, Derrida hoped to show deconstruction at work, i.e., the ways that this originary complexity—which by definition cannot ever be completely known—works its structuring and destructuring effects. Many debates in continental philosophy surrounding ontology, epistemology, ethics, aesthetics, hermeneutics, and philosophy of language refer to Derrida's observations. Since the 1980s, these observations inspired a range of theoretical enterprises in the humanities,[1] including the disciplines of law[2]:3–76[3][4] anthropology,[5] historiography,[6] linguistics,[7] sociolinguistics,[8] psychoanalysis, LGBT studies, and the feminist school of thought. Deconstruction also inspired deconstructivism in architecture and remains important within art,[9] music,[10] and literary criticism.[11] While common in continental Europe (and wherever Continental Philosophy is in the mainstream), deconstruction is not adopted or accepted by most philosophy departments in universities where Analytic Philosophy has the upper hand.[12][not in citation given] ^ 'Deconstruction'. Encyclopedia Britannica. Retrieved 8 September 2017. ^ Allison, David B.; Garver, Newton (1973). Speech and Phenomena and Other Essays on Husserl's Theory of Signs (5th ed.). Evanston: Northwestern University Press. ISBN 0810103974. Retrieved 8 September 2017. A decision that did not go through the ordeal of the undecidable would not be a free decision, it would only be the programmable application or unfolding of a calculable process...[which] deconstructs from the inside every assurance of presence, and thus every criteriology that would assure us of the justice of the decision. ^ 'Critical Legal Studies Movement'. The Bridge. Retrieved 8 September 2017. ^ 'German Law Journal - Past Special Issues'. 16 May 2013. Archived from the original on 16 May 2013. Retrieved 8 September 2017. ^ Morris, Rosalind C. (September 2007). 'Legacies of Derrida: Anthropology'. Annual Review of Anthropology. 36 (1): 355–389. doi:10.1146/annurev.anthro.36.081406.094357. ^ Munslow, Alan (1997). 'Deconstructing History' (PDF). Institute of Historical Research. Retrieved 8 September 2017. ^ Busch, Brigitta (1 December 2012). 'The Linguistic Repertoire Revisited'. Applied Linguistics. pp. 503–523. doi:10.1093/applin/ams056. Retrieved 8 September 2017. ^ Esch, &; Solly, Martin (2012). The Sociolinguistics of Language Education in International Contexts. Bern: Peter Lang. pp. 31–46. ISBN 9783034310093. ^ 'Deconstruction – Art Term'. Tate. Retrieved 16 September 2017. Since Derrida’s assertions in the 1970s, the notion of deconstruction has been a dominating influence on many writers and conceptual artists. ^ Cobussen, Marcel (2002). 'Deconstruction in Music. The Jacques Derrida – Gerd Zacher Encounter' (PDF). Thinking Sounds. Retrieved 8 September 2017. ^ Douglas, Christopher (31 March 1997). 'Glossary of Literary Theory'. University of Toronto English Library. Retrieved 16 September 2017. ^ Kandell, Jonathan (10 October 2004). 'Jacques Derrida, Abstruse Theorist, Dies at 74'. The New York Times. Retrieved 1 June 2017."

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

	onClickSearch(null, DECONSTRUCTION);
};


const onClickSearch = (e, searchText) => {
	console.log('on click search');
	// if (!searchText) searchText = document.querySelector('.search__text').textContent;

	if (searchText) {
		responsiveVoice.speak(searchText);
		updateText(searchText.substring(0, 2000));
	} else {
		const url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=${encodeURIComponent(currentSearch.toLowerCase())}&origin=*`;
		// const url = 'https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=Belgium&limit=5';
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

			const markup = data.parse.text['*'];
			const cleanMarkup = strip(markup).replace(/(\r\n|\n|\r)/gm,' ').replace(/\s\s+/g, ' ');
			responsiveVoice.speak(cleanMarkup);
			updateText(cleanMarkup.substring(0, 2000));
		}).catch(err => console.log(err));
		
	}
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

