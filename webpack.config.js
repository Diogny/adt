const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

console.log('webpack __dirname', __dirname);

const commonConfig = {
	node: {
		__dirname: true
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.ts(x)?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					"css-loader"
				]
			},
			{
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				loader: 'file-loader',
				options: {
					name: 'img/[name].[ext]',
					publicPath: '../',
				},
			},
		]
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin({ /*configFile: "./path/to/tsconfig.json" */ })],
		alias: {
			components: path.resolve(process.cwd(), 'src/'),
		},
		extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
	}
}

module.exports = env => {
	commonConfig.mode = env.mode;
	console.log('enviroment: ', env.mode)

	return [
		Object.assign(
			{
				devServer: {
					contentBase: path.resolve(__dirname, 'dist/test/www'),
					hot: true,
					port: 9000
				},
				entry: {
					index: ['./src/test/index.ts', './src/test/css/styles.css']
				},
				output: {
					path: path.resolve(__dirname, 'dist/test/www'), // __dirname, //
					filename: '[name].js',
				},
				plugins: [
					new MiniCssExtractPlugin({
						filename: "[name].css"
					}),
					new HtmlWebpackPlugin({
						//hash: true,
						title: 'Binary Tree tests',
						myPageHeader: 'Hello World',
						template: './src/test/index.html',
						filename: 'index.html'
					}),
					new CopyPlugin({
						patterns: [
							{ from: './src/test/favicon.ico', to: 'favicon.ico' },
						]
					}),
					new webpack.NamedModulesPlugin(),
					new webpack.HotModuleReplacementPlugin(),
				],
			},
			commonConfig),
		Object.assign(
			{
				entry: {
					rbt: ['./src/test/rbt.ts', './src/test/css/rbt.css']
				},
				output: {
					path: path.resolve(__dirname, 'dist/test/www'), // __dirname, //
					filename: '[name].js',
				},
				plugins: [
					new MiniCssExtractPlugin({
						filename: "[name].css"
					}),
					new HtmlWebpackPlugin({
						title: 'Binary Tree tester',
						template: './src/test/rbt.html',
						filename: 'rbt.html'
					}),
				],
			},
			commonConfig),
	];
}