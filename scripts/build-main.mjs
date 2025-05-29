// File: scripts/build-main.mjs
import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// VALIDATION: Check dependencies exist
const validateDependencies = () => {
  const requiredPaths = [
    resolve(__dirname, '../packages/svarog-ui/src/index.js'),
    resolve(__dirname, '../packages/svarog-ui-core/src/index.js'),
    resolve(__dirname, '../packages/@svarog-ui/theme-default/dist/index.js'),
  ];

  const missing = requiredPaths.filter((path) => !existsSync(path));

  if (missing.length > 0) {
    console.error('❌ Missing required dependencies:');
    missing.forEach((path) => console.error(`   ${path}`));
    console.error('\n   Run: npm run build:core && npm run build:themes first');
    process.exit(1);
  }

  console.log('✅ Dependencies validated');
};

async function buildMain() {
  console.log('🔨 Building main svarog-ui package...\n');

  // Validate dependencies first
  validateDependencies();

  // Ensure dist directory exists
  const distDir = resolve(__dirname, '../packages/svarog-ui/dist');
  mkdirSync(distDir, { recursive: true });

  try {
    // Build the main package
    await build({
      entryPoints: [resolve(__dirname, '../packages/svarog-ui/src/index.js')],
      bundle: true,
      outfile: resolve(distDir, 'index.js'),
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      // These are external - users need to install them
      external: ['svarog-ui-core', '@svarog-ui/theme-default'],
      minify: true,
      sourcemap: false,
      metafile: true,
    });

    console.log('✅ Main package built successfully');
    console.log(`📁 Output: ${resolve(distDir, 'index.js')}`);

    // Show bundle size
    const stats = await import('fs').then((fs) =>
      fs.statSync(resolve(distDir, 'index.js'))
    );
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 Bundle size: ${fileSizeInKB} KB`);
  } catch (error) {
    console.error('❌ Main build failed:', error);
    process.exit(1);
  }
}

buildMain();
