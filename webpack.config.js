const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('dotenv').config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // Get environment variables
  const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com/api/v1';
  const REACT_APP_GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  
  return {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.REACT_APP_API_BASE_URL': JSON.stringify(REACT_APP_API_BASE_URL),
        'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(REACT_APP_GOOGLE_CLIENT_ID),
        'process.env': JSON.stringify({
          REACT_APP_API_BASE_URL: REACT_APP_API_BASE_URL,
          REACT_APP_GOOGLE_CLIENT_ID: REACT_APP_GOOGLE_CLIENT_ID,
        }),
      }),
      // Copy public assets to dist folder
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public/assets',
            to: 'assets',
            noErrorOnMissing: true,
          },
          {
            from: 'public/manifest.json',
            to: 'manifest.json',
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devServer: {
      port: 3001,
      hot: true,
      historyApiFallback: {
        index: '/',
        disableDotRule: true,
      },
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
    },
  };
};

