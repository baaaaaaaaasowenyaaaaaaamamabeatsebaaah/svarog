import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development', // Add explicit mode
  entry: {
    main: './.storybook/main.js',
    preview: './.storybook/preview.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.css', '.svg'],
    enforceExtension: false,
    fullySpecified: false, // Add this to handle ESM imports without extensions
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
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        use: 'file-loader',
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
