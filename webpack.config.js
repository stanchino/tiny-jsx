const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const DIST_PATH = path.resolve(__dirname, 'build');
const production = process.env.NODE_ENV === 'production';
const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

module.exports = {
  target: 'web',
  name: 'client',
  devtool: development ? 'cheap-module-source-map' : undefined,
  devServer: {
    compress: true,
    hot: true,
    hotOnly: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'public'),
  },
  entry: {
    clock: './examples/clock/index.jsx',
    todos: './examples/todos/index.jsx',
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss"],
    /* NOTE: Uncomment this when making changes to the library files to use the local build */
    alias: {
      'tiny-jsx': path.resolve(__dirname, './dist/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    path: DIST_PATH,
    publicPath: '/',
    filename: production ? '[name].[contenthash].js' : '[name].js',
    chunkFilename: production ? '[name].[contenthash].js' : '[name].[chunkhash].js',
    libraryTarget: 'umd',
    globalObject: 'window',
  },
  optimization: {
    nodeEnv: development ? 'development' : 'production',
    mangleWasmImports: true,
    splitChunks: {
      chunks: 'async',
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      minSize: 0,
      hidePathInfo: true,
      name: false,
      automaticNameDelimiter: '.',
      cacheGroups: {
        tiny: {
          name: 'tiny-jsx',
          chunks: 'initial',
          test: /[\\/]dist[\\/]/,
          priority: -10,
        },
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'clock.html',
      excludeChunks: ['todos'],
    }),
    new HtmlWebpackPlugin({
      filename: 'todos.html',
      excludeChunks: ['clock'],
    }),
    new CompressionPlugin(),
    production && new webpack.HashedModuleIdsPlugin(),
    production && new BundleAnalyzerPlugin({ analyzerMode: 'static', reportFilename: path.join(DIST_PATH, 'report.html') }),
  ].filter(Boolean),
};
