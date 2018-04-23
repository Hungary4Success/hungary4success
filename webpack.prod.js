const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = [
  merge(common[0], {
    mode: 'production'
  }),
  merge(common[1], {
    mode: 'production',
    plugins: [
      new UglifyJSPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        API_URL: JSON.stringify('https://startup-simulator.herokuapp.com/api')
      })
    ]
  })
];
