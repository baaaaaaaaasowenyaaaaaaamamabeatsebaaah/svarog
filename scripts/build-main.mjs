import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildMain() {
  // Ensure dist directory exists
  mkdirSync(resolve(__dirname, '../packages/svarog-ui/dist'), {
    recursive: true,
  });

  try {
    // Build the main package
    await build({
      entryPoints: [resolve(__dirname, '../packages/svarog-ui/src/index.js')],
      bundle: true,
      outfile: resolve(__dirname, '../packages/svarog-ui/dist/index.js'),
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      // These are external - users need to install them
      external: ['svarog-ui-core', '@svarog-ui/theme-default'],
      minify: true,
      sourcemap: false,
    });

    console.log('✅ Main package built successfully');
  } catch (error) {
    console.error('❌ Main build failed:', error);
    process.exit(1);
  }
}

buildMain();
