const path = require('path')
const fs = require("fs");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../dist'),
	assets: 'assets/'
};

// Pages const for HtmlWebpackPlugin
// see more: https://github.com/vedees/webpack-template/blob/master/README.md#html-dir-folder
// const PAGES_DIR = PATHS.src;	//вариант попроще
// const PAGES_DIR = `${PATHS.src}/html`	//в таком случае весь html будет браться из папки html и попадать в папку dist
// const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith(".html"));

// const PAGES_DIR = `${PATHS.src}/pug/pages/`	//было
const PAGES_DIR = `${PATHS.src}`								//стало
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith(".pug"));

module.exports = {

	externals: {		//с помощью externals, для PATHS создаём ярлык paths,
		paths: PATHS	//что бы обращаться к нему в других конфигах можно было.
	},

	entry: {
		// app: './src/index.js'
		app: PATHS.src,
		// lk: `${PATHS.src}/lk.js`	//вторая точка входа, например для личного кабинета, или что бы разделить основной файл js если он большой
	},

	output: {
		filename: `${PATHS.assets}js/[name].js`,			//без хеша
		// filename: `${PATHS.assets}js/[name].[hash].js`,	//c хешем
		path: PATHS.dist,
		// publicPath: '/'		//26-03-2020
		// filename: '[name].js',
		// path: path.resolve(__dirname, '../dist'),
		// publicPath: '/dist'
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendors',
					test: /node_modules/,
					chunks: 'all',
					enforce: true
				}
			}
		}
	},

	module: {
		rules: [
			{
				test: /\.pug$/,
				loader: 'pug-loader',
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			}, {
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]'
				}
			}, {
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
				}
			}, {
				test: /\.scss$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					}, {
						loader: 'postcss-loader',
						options: { sourceMap: true, config: { path: `./postcss.config.js` } }
					}, {
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			}, {
				test: /\.css$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					}, {
						loader: 'postcss-loader',
						options: { sourceMap: true, config: { path: `./postcss.config.js` } }
					}
				]
			}, 
		]
	},

	// resolve: {
	// 	alias: {
	// 		// '~': 'src',	//создание алиаса, пример его использования в Example.vue
	// 		'vue$': 'vue/dist/vue.js'
	// 	}
	// },

	plugins: [
		new MiniCssExtractPlugin({
			filename: `${PATHS.assets}css/[name].css`,			//без хеша
			// filename: `${PATHS.assets}css/[name].[hash].css`,	//с хешем
		}),


		// ignore: ['*.pug', '*.scss', '*.js', 'static/*'],


		new CopyWebpackPlugin([
			{
				from: `${PATHS.src}`,
				to: `${PATHS.assets}`,
				ignore: ['*.pug', '*.scss', '*.js', 'static/**/*'],
			},
			{ from: `${PATHS.src}/static`, to: '' },
		]),

		// new CopyWebpackPlugin([
		// 	{ from: `${PATHS.src}`, to: `${PATHS.assets}img` },
		// 	// { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
		// 	{ from: `${PATHS.src}`, to: `${PATHS.assets}fonts` },
		// 	// { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
		// 	{ from: `${PATHS.src}/static`, to: '' },
		// ]),
		// new CopyWebpackPlugin([
		// 	{ from: PATHS.src + '/img', to: `img` },
		// 	{ from: PATHS.src + '/static' },
		// ]),

		// Copy HtmlWebpackPlugin and change index.html for another html page
		// new HtmlWebpackPlugin({
		// 	// hash: false,
		// 	template: `${PATHS.src}/index.html`,
		// 	filename: './index.html',
		// 	inject: true		//авто вставка стилей на страницу
		// }),
		// new HtmlWebpackPlugin({
		//   hash: false,
		//   template: './src/index.html',
		//   filename: 'index.html',
		// }),

    /*	Первый способ - автоматическое добавление страниц
      Automatic creation any html pages (Don't forget to RERUN dev server!)
      See more:
      https://github.com/vedees/webpack-template/blob/master/README.md#create-another-html-files
      Best way to create pages:
      https://github.com/vedees/webpack-template/blob/master/README.md#third-method-best
    */
		...PAGES.map(
			page =>
				new HtmlWebpackPlugin({
					// template: `${PAGES_DIR}`,
					template: `${PAGES_DIR}/${page}`,
					// filename: `./${page}`
					filename: `./${page.replace(/\.pug/, '.html')}`	//эта строчка ищет файлы *pug и "реплейсит" их в *.html
				})
		),

		// Второй способ - ручной (можно легко связывать с первым способом)
		// new HtmlWebpackPlugin({
		// 	template: `${PAGES_DIR}/html/index.html`,	//откуда и какой файл копируем (из src/html/)
		// 	filename: './index.html',		//куда копируем - в корень проекта (папка dist)
		// 	inject: true
		// }),
		// new HtmlWebpackPlugin({
		// 	template: `${PAGES_DIR}/html/about.html`,	//откуда и какой файл копируем (из src/html/)
		// 	filename: './mega.html',		//куда копируем - в корень проекта (папка dist)
		// 	inject: true
		// }),
		// // new HtmlWebpackPlugin({
		// //   template: `${PAGES_DIR}/about/portfolio.pug`,
		// //   filename: './about/portfolio.html',
		// //   inject: true
		// // })
	],
}
