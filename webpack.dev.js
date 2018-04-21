const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = [
  merge(common[0], {
    mode: 'development'
  }),
  merge(common[1], {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './www'
    },
    plugins: [
      new webpack.DefinePlugin({
        API_URL: JSON.stringify('https://localhost/api')
      })
    ]
  })
];
