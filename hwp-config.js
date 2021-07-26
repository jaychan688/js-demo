// Replacement for native fs
const fse = require('fs-extra')
// Remove/clean your build folder(s).
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Simplifies creation of HTML files to serve your bundles
const HtmlWebpackPlugin = require('html-webpack-plugin')

/***************** Entry and Plugins Config file ****************/
/**
 * entry key 設定為 `${folder}/index`, 輸出index.js檔到 folder 資料夾
 * HtmlWebpackPlugin
 * 	chunks 要跟 entry key match, 才會自動將 js 注入到對應的 html裡
 * 	filename設為 `${folder}/index.html`, 將index.html輸出到 folder資料夾
 * MiniCssExtractPlugin
 * 	filename: [name].[chunkhash].css, 將 index.css 放在同資料夾下
 * output 跟 MiniCssExtractPlugin的 filename: [name]會複製成 entry key,
 * 這裡我用 `${folder}/index`,所以全部取名為 index, 也可以用${folder}取代
 */

// Copy images folder
class RunAfterCompile {
	apply(compiler) {
		compiler.hooks.done.tap('Copy images', () => {
			fse.copySync('./src/images', './dist/images')
		})
	}
}

// 讀取 ./src/pages 內所有的資料夾名稱
const folders = fse.readdirSync('./src/pages')

const generateEntries = pageArray => {
	return pageArray.reduce((entry, folder) => {
		entry[`${folder}/index`] = `./src/pages/${folder}/script.js`
		return entry
	}, {})
}

const generateHtmlPlugin = page => {
	// Factory pattern
	return new HtmlWebpackPlugin({
		title: page,
		filename: `${page.toLowerCase()}/index.html`,
		template: `./src/pages/${page.toLowerCase()}/index.html`,
		inject: true,
		chunks: [`${page}/index`],
	})
}

const populateHtmlPlugins = pageArray =>
	pageArray.map(page => generateHtmlPlugin(page))

let entries = generateEntries(folders)

entries = { ...entries, index: './src/index.js' }

const htmlPlugins = populateHtmlPlugins(folders)

const plugins = [
	new CleanWebpackPlugin(),
	...htmlPlugins,
	new HtmlWebpackPlugin({
		template: `./src/index.html`,
		filename: 'index.html',
		inject: true,
		chunks: ['index'],
	}),
	new RunAfterCompile(),
]

module.exports = {
	entries,
	plugins,
}
