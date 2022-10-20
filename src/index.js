import chroma from "chroma-js";
import "./index.html";
import "./index.scss";

const columns = document.querySelectorAll('.column');

document.addEventListener('keydown', (event) => {
	event.preventDefault();
	if (event.code.toLocaleLowerCase() === 'space') {
		setRandomColors();
	};
});

document.addEventListener('click', (event) => {
	event.preventDefault();
	const type = event.target.dataset.type;

	if (type === 'lock') {
		const node = event.target.tagName.toLowerCase() === 'i'
			? event.target
			: event.target.children[0];

		node.classList.toggle('fa-lock-open');
		node.classList.toggle('fa-lock');
	} else if (type === 'copy') {
		copyToClipboard(event.target.textContent);
	}
});

function copyToClipboard(text) {
	return navigator.clipboard.writeText(text);
}

setRandomColors(true);

function setRandomColors(isInitial) {
	const colors = isInitial ? getColorsFromHash() : [];
	let delay = 0;

	columns.forEach((col, index) => {
		const isLocked = col.querySelector('i').classList.contains('fa-lock');
		const text = col.querySelector('h2');
		const button = col.querySelector('button');

		if (isLocked) {
			colors.push(text.textContent);
			return;
		}

		const color = isInitial
			? colors[index]
				? colors[index]
				: chroma.random()
			: chroma.random();

		if (!isInitial) {
			colors.push(color);
		}

		delay += 500;

		// setTimeout(() => {
		text.textContent = color;
		col.style.background = color;
		// }, delay);

		checkBrightness(color, text);
		checkBrightness(color, button);
	});

	updateColorsHash(colors);
}

function checkBrightness(color, text) {
	text.style.color = chroma(color).luminance() >= 0.5 ? 'black' : 'white';
}

function updateColorsHash(colors = []) {
	document.location.hash = colors.map(col => col.toString().substring(1)).join('-');
}

function getColorsFromHash() {
	if (document.location.hash.length > 1) {
		return document.location.hash
			.substring(1)
			.split('-')
			.map(col => '#' + col);
	}
	return [];
}