import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from '../.storybook/webpack.dev.config.js';

const compiler = webpack(config);
const devServerOptions = { ...config.devServer };
const server = new WebpackDevServer(devServerOptions, compiler);

server
  .start()
  .then(() => {
    console.log('Dev server is running on http://localhost:8080');
  })
  .catch((err) => {
    console.error('Failed to start dev server:', err);
    process.exit(1);
  });
