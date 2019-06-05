const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const DIST_PATH = path.resolve(__dirname, 'build');
const production = process.env.NODE_ENV === 'production';
const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const mode = development ? 'development' : 'production';

module.exports = {
  target: 'web',
  mode,
  name: 'client',
  devtool: development ? 'inline-source-map' : undefined,
  devServer: {
    compress: true,
    hot: true,
    hotOnly: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'public'),
  },
  entry: {
    app: './src/examples/index.jsx',
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss"],
    alias: {
      'tiny-jsx': path.resolve(__dirname, './dist/tiny-jsx.js'),
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      /*
      {
        test: /\.scss$/,
        use: [
          'isomorphic-style-loader',
          { loader: 'css-loader', options: { modules: true, sourceMap: false, importLoaders: 2 } },
          'postcss-loader', // Run post css actions
          'sass-loader', // compiles Sass to CSS
        ],
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.(png|svg|jpe?g|gif|woff|woff2|eot|ttf)$/,
        use: { loader: 'file-loader', options: { emitFile: true } },
      },
      */
    ],
  },
  output: {
    path: DIST_PATH,
    publicPath: '/',
    filename: production ? '[name].[contenthash].js' : '[name].js',
    chunkFilename: production ? '[name].[contenthash].js' : '[name].[chunkhash].js',
    // libraryTarget: 'umd',
    // globalObject: 'window',
  },
  optimization: {
    nodeEnv: mode,
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
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: -15,
        },
        tinyJSX: {
          name: 'tiny-jsx',
          chunks: 'initial',
          test: /[\\/]tiny-jsx/,
          priority: -15,
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
    new HtmlWebpackPlugin(),
    new CompressionPlugin(),
  ],
};
