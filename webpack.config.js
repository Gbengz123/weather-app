const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  output: {
    //We use the content hash for keeping track of cache
    filename: '[name].[contenthash].js', //This name value will be whatever the property name is on line 6
    path: path.resolve(__dirname, 'dist'),
    clean: true, //Cleans hash
    assetModuleFilename: '[name][ext]', //To maintain asset file name
  },

  devServer: {
    static: {
      //The folder we are serving
      directory: path.join(__dirname, 'dist'),
    },
    open: true, //Opens browser automatically when we run dev
    hot: true, //For hot reloading
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },

  module: {
    rules: [
      // For loadind images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // For loading fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // CSS loader for using styles
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // Babel laoder
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.svg$/,
        use: 'svg-inline-loader', // Inline SVG as raw text
      },
    ],
  },

  // HTML webpack plugin
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack App',
      filename: 'index.html',

      //Sets an html template that index.html will inherit from
      template: 'src/template.html',
    }),

    // New BundleAnalyzerPlugin(),
  ],
};
