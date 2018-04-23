const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const jsxRules = {
  rules: [{
    test: /\.jsx$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader'
    }
  }]
};

// Server configuration
const serverConfig = {
  context: path.resolve(__dirname, 'server'),
  entry: './server.jsx',
  output: {
    path: __dirname,
    filename: './server.bundle.js'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      API_URL: "process.env.NODE_ENV === 'production' ? 'https://startup-simulator.herokuapp.com/api' : 'https://localhost/api'"
    })
  ],
  module: jsxRules
};

// Client configuration
const clientConfig = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './index.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'www'),
    publicPath: '/images/',
    filename: './bundle.js'
  },
  module: jsxRules
};

module.exports = [serverConfig, clientConfig];
