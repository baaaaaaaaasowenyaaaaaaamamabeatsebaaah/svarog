import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from '../.storybook/webpack.config.js';

const compiler = webpack(config);
const server = new WebpackDevServer(config.devServer, compiler);

server.start().catch((err) => {
  console.error('Error starting dev server:', err);
  process.exit(1);
});
