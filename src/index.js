import './index.css'

const components = [
	'mosh-navbar',
	'brad-navbar',
	'reveal-on-scroll',
	'modal',
	'playground',
]

const componentsLinks = components
	.map(
		components =>
			`<li><a class="list__item" target="_blank" href="${components}/index.html">${components}</a></li>`
	)
	.join('')

document
	.querySelector('#root')
	.insertAdjacentHTML(
		'beforeend',
		`<ul class="list list--green">${componentsLinks}</ul>`
	)
