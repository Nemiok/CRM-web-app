/* eslint-disable no-undef */
const path = require('path');

module.exports = (env) => ({
  target: 'node',

  resolve: {
    modules: ['node_modules'],
  },

  entry: path.resolve(__dirname, '../crm-backend/src/index.js'),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ]
  },

  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: '[name].js',
  },

});
