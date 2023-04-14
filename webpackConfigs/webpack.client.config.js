/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');

module.exports = (env) => ({
  target: 'web',
  resolve: {
    modules: ['node_modules'],
  },
  entry: path.resolve(__dirname, '../crm-frontend/src/index.js'),

  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    open: true,
    hot: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'CRM',
      filename: 'index.html',
      template: path.resolve(__dirname, '../crm-frontend/src/crm.html'),
      clear: true
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/i,
        type: 'asset',
        use: 'svgo-loader',
      },
      {
        test: /\.css$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
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
    path: path.resolve(__dirname, '../dist/'),
    filename: '[name].js',
  },

  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              [
                'svgo',
                {
                  plugins: extendDefaultPlugins([
                    {
                      name: 'removeViewBox',
                      active: false,
                    },
                    {
                      name: 'addAttributesToSVGElement',
                      params: {
                        attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                      },
                    },
                  ]),
                },
              ],
            ]
          }
        }
      })
    ]
  }
});
