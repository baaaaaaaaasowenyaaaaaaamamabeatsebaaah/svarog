import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import webpack from 'webpack';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './dist-entry.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      library: 'SvarogUI',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /\.md$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /\/(CHANGELOG|LICENSE|README)\.md$/,
        contextRegExp: /@svarog-ui/,
      }),
      ...(isProduction
        ? [
            new webpack.IgnorePlugin({
              resourceRegExp: /cabalou-theme\.css$/,
            }),
            new webpack.IgnorePlugin({
              resourceRegExp: /muchandy-theme\.css$/,
            }),
          ]
        : []),
    ],
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.info', 'console.debug'],
                  passes: 3,
                },
                mangle: {
                  properties: {
                    regex: /^_/,
                  },
                  toplevel: true,
                },
                format: {
                  comments: false,
                  ascii_only: true,
                },
              },
              extractComments: false,
            }),
            new CssMinimizerPlugin(),
          ],
          usedExports: true,
          sideEffects: false,
        }
      : {},
    devtool: isProduction ? false : 'source-map',
  };
};
