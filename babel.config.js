module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				// 取代 @babel/polyfill
				useBuiltIns: 'usage',
				corejs: 3,
				// debug: true,
			},
		],
		[
			'@babel/preset-react',
			{
				// react 17 之後新功能，寫jxs語法，可以不用 import React from 'react'
				runtime: 'automatic',
			},
		],
	],
}
