import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildCore() {
  // Ensure dist directory exists
  mkdirSync(resolve(__dirname, '../packages/svarog-ui-core/dist'), {
    recursive: true,
  });

  try {
    // Build the core package
    await build({
      entryPoints: [
        resolve(__dirname, '../packages/svarog-ui-core/src/index.js'),
      ],
      bundle: true,
      outfile: resolve(__dirname, '../packages/svarog-ui-core/dist/index.js'),
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      // Don't bundle theme packages
      external: ['@svarog-ui/*'],
      minify: true,
      sourcemap: false,
    });

    console.log('✅ Core package built successfully');
  } catch (error) {
    console.error('❌ Core build failed:', error);
    process.exit(1);
  }
}

buildCore();
