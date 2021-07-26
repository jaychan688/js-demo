const path = require('path')
// Extracts CSS into separate files.
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { entries, plugins } = require('./hwp-config')

const isProduction = process.env.NODE_ENV || false
const target = isProduction ? 'browserslist' : 'web'
const devtool = isProduction ? false : 'source-map'
const mode = isProduction || 'development'

/*********** COMMON  ************/
const cssConfig = {
	test: /\.css$/i,
	use: ['css-loader', 'postcss-loader'],
}

const sassConfig = {
	test: /\.scss$/i,
	use: ['css-loader', 'postcss-loader', 'sass-loader'],
}

const config = {
	entry: entries,
	plugins,
	mode,
	target,
	devtool,
	module: {
		rules: [
			cssConfig,
			sassConfig,
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: ['babel-loader'],
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline',
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
}

/*********** DEVELOPMENT  ************/
if (!isProduction) {
	// dev模式用 style-loader，這樣在看 source-map 時才能找到正確的原始黨位置
	cssConfig.use.unshift('style-loader')
	sassConfig.use.unshift('style-loader')

	config.output = {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[chunkhash].js',
	}

	config.devServer = {
		// Middleware:  html auto reload - full page reload
		before: (app, server) => {
			server._watch('./src/**/*.html')
		},
		contentBase: path.join(__dirname, 'dist'),
		hot: true,
		port: 3000,
		historyApiFallback: true,
		host: '0.0.0.0',
	}
}

/*********** PRODUCTION  ************/
if (isProduction) {
	cssConfig.use.unshift(MiniCssExtractPlugin.loader)
	sassConfig.use.unshift(MiniCssExtractPlugin.loader)

	config.output = {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
	}

	config.optimization = {
		splitChunks: { chunks: 'all' },
	}

	config.plugins.push(
		new MiniCssExtractPlugin({ filename: '[name].[chunkhash].css' })
	)
}

module.exports = config
