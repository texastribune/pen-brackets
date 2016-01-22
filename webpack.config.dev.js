var path = require('path')
var webpack = require('webpack')

module.exports = {
  context: path.join(__dirname, '/app/scripts'),
  entry: {
    main: './main.js'
  },
  output: {
    path: path.join(__dirname, '/.tmp/scripts'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: 2
    })
  ]
}
