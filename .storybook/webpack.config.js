import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: {
    main: './.storybook/main.js',
    preview: './.storybook/preview.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    // Configure output for Asset Modules
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  resolve: {
    extensions: ['.js', '.css', '.svg'],
    enforceExtension: false,
    fullySpecified: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Use Asset Modules for images and SVGs
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, '../public'),
      },
      {
        directory: path.resolve(__dirname, '../src/styles'),
      },
    ],
    compress: true,
    port: 8080,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
