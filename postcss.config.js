// npm install postcss-loader autoprefixer css-mqpacker cssnano --save-dev

module.exports = {
  plugins: [  //во все плагины мы можем передовать какие то настройки
		// require('precss'),
    require('autoprefixer'),  //проставляет префиксы стилям
    require('css-mqpacker'),  //сжимает все медиа запросы в 1 файл
    require('cssnano')({      //максимально минифицирует исходные стили
      preset: [
        'default', {
          discardComments: {
            removeAll: true,  //удалять комментарии
          }
        }
      ]
    })
  ]
}
