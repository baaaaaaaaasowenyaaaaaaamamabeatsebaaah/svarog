import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, statSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildCore() {
  console.log('🔨 Building svarog-ui-core package...\n');

  // First, prepare the core package with all files
  console.log('📋 Step 1: Preparing core package files...');
  execSync('node scripts/prepare-core-package.mjs', {
    stdio: 'inherit',
    cwd: resolve(__dirname, '..'),
  });

  // Ensure dist directory exists
  const distDir = resolve(__dirname, '../packages/svarog-ui-core/dist');
  mkdirSync(distDir, { recursive: true });

  console.log('\n📦 Step 2: Building distribution bundle...');

  try {
    // Build the core package bundle
    await build({
      entryPoints: [
        resolve(__dirname, '../packages/svarog-ui-core/src/index.js'),
      ],
      bundle: true,
      outfile: resolve(distDir, 'index.js'),
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      // External packages that users need to install separately
      external: ['@svarog-ui/*'],
      minify: true,
      sourcemap: false,
      // Preserve CSS imports for style injection
      loader: {
        '.css': 'text',
      },
      // Tree-shaking optimizations
      treeShaking: true,
      metafile: true,
    });

    console.log('\n✅ Core package built successfully!');
    console.log(`📁 Output: ${resolve(distDir, 'index.js')}`);

    // Show bundle size
    const stats = statSync(resolve(distDir, 'index.js'));
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 Bundle size: ${fileSizeInKB} KB`);
  } catch (error) {
    console.error('\n❌ Core build failed:', error);
    process.exit(1);
  }
}

buildCore();
