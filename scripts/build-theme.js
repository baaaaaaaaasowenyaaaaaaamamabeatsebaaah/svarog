#!/usr/bin/env node
import { build } from 'esbuild';
import { resolve } from 'path';

const themeName = process.argv[2];
if (!themeName) {
  console.error('Please provide theme name');
  process.exit(1);
}

const themePath = resolve(`packages/@svarog-ui/theme-${themeName}`);

build({
  entryPoints: [`${themePath}/src/index.js`],
  bundle: true,
  outfile: `${themePath}/dist/index.js`,
  format: 'esm',
  target: 'es2020',
  external: ['svarog-ui-core'],
  minify: true,
}).catch(() => process.exit(1));
