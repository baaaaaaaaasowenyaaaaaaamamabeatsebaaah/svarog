// .storybook/webpack.config.js
import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isProduction = argv?.mode === 'production';

  return {
    mode: argv?.mode || 'development',
    entry: {
      main: './.storybook/main.js',
      preview: './.storybook/preview.js',
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
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
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset',
          generator: {
            filename: isProduction
              ? 'assets/[name].[contenthash][ext]'
              : 'assets/[name][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 10kb - inline smaller assets
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /\.md$/,
      }),
      new webpack.DefinePlugin({
        'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(
          process.env.GOOGLE_MAPS_API_KEY || ''
        ),
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /\/(CHANGELOG|LICENSE|README)\.md$/,
        contextRegExp: /@svarog-ui/,
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash].css',
            }),
          ]
        : []),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
      }),
    ],
    resolve: {
      extensions: ['.js'],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, '../public'),
      },
      compress: true,
      port: process.env.PORT || 8080,
      host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
      allowedHosts:
        process.env.NODE_ENV === 'production'
          ? ['localhost', '.railway.app', '.up.railway.app']
          : 'auto',
      hot: 'only',
      historyApiFallback: true,
      open: false,
      client: {
        overlay: true,
      },
    },
    optimization: isProduction
      ? {
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                enforce: true,
              },
            },
          },
        }
      : {},
    // Silence asset size warnings for large images - handle manually
    performance: {
      hints: false,
    },
  };
};
