import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, statSync, readFileSync } from 'fs';
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

  console.log('\n📦 Step 2: Building optimized distribution bundle...');

  try {
    // Build the core package bundle with optimizations
    const result = await build({
      entryPoints: [
        resolve(__dirname, '../packages/svarog-ui-core/src/index.js'),
      ],
      bundle: true,
      outfile: resolve(distDir, 'index.js'),
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      // External - don't bundle these (users provide them)
      external: [],

      // Optimization settings
      minify: true,
      treeShaking: true,
      sourcemap: false, // Disable sourcemap to reduce size

      // Bundle splitting (if needed)
      splitting: false,

      // Loader configuration
      loader: {
        '.css': 'text',
        '.js': 'js',
      },

      // Define environment variables to help with dead code elimination
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.BROWSER': 'true',
      },

      // Custom plugins for optimization
      plugins: [
        {
          name: 'css-text-loader',
          setup(build) {
            // Handle CSS files as text
            build.onLoad({ filter: /\.css$/ }, async (args) => {
              const css = await readFileSync(args.path, 'utf8');

              // Minify CSS
              const minifiedCSS = css
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .replace(/;\s*}/g, '}') // Remove last semicolon before }
                .replace(/\s*{\s*/g, '{') // Clean up braces
                .replace(/;\s*/g, ';') // Clean up semicolons
                .trim();

              return {
                contents: `export default ${JSON.stringify(minifiedCSS)};`,
                loader: 'js',
              };
            });
          },
        },
        {
          name: 'size-optimizer',
          setup(build) {
            // Remove development-only code
            build.onLoad({ filter: /\.js$/ }, async (args) => {
              const content = await readFileSync(args.path, 'utf8');

              // Skip if it's already a CSS module
              if (args.path.includes('.css.js')) {
                return null; // Let default loader handle it
              }

              // Remove console.log statements in production
              const optimizedContent = content
                .replace(/console\.log\([^)]*\);?/g, '') // Remove console.log
                .replace(/console\.warn\([^)]*\);?/g, '') // Remove console.warn
                .replace(/console\.info\([^)]*\);?/g, '') // Remove console.info
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
                .replace(/\/\/.*$/gm, '') // Remove line comments
                .replace(/\n\s*\n/g, '\n') // Remove empty lines
                .trim();

              return {
                contents: optimizedContent,
                loader: 'js',
              };
            });
          },
        },
      ],

      // Metafile for analysis
      metafile: true,

      // Advanced minification options
      minifyWhitespace: true,
      minifyIdentifiers: true,
      minifySyntax: true,

      // Keep names for better debugging (but still minify)
      keepNames: false,

      // Legal comments
      legalComments: 'none',
    });

    console.log('\n✅ Core package built successfully!');
    console.log(`📁 Output: ${resolve(distDir, 'index.js')}`);

    // Show bundle size and analysis
    const stats = statSync(resolve(distDir, 'index.js'));
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`📊 Bundle size: ${sizeKB} KB`);

    // Check if bundle is within size limit
    const maxSizeKB = 100;
    if (parseFloat(sizeKB) > maxSizeKB) {
      console.warn(
        `⚠️  Bundle size (${sizeKB}KB) exceeds recommended limit (${maxSizeKB}KB)`
      );
      console.log('\n💡 Optimization suggestions:');
      console.log('   - Consider splitting large components');
      console.log('   - Review which utilities are being bundled');
      console.log('   - Check for duplicate code');
    } else {
      console.log(`✅ Bundle size within limit (${maxSizeKB}KB)`);
    }

    // Save metafile for analysis
    if (result.metafile) {
      const { writeFileSync } = await import('fs');
      writeFileSync(
        resolve(distDir, 'metafile.json'),
        JSON.stringify(result.metafile, null, 2)
      );
      console.log(`📊 Build analysis: ${resolve(distDir, 'metafile.json')}`);

      // Analyze bundle composition
      console.log('\n📈 Bundle composition:');
      const inputs = Object.keys(result.metafile.inputs);
      const jsFiles = inputs.filter((f) => f.endsWith('.js')).length;
      const cssFiles = inputs.filter((f) => f.endsWith('.css')).length;

      console.log(`   - JavaScript files: ${jsFiles}`);
      console.log(`   - CSS files: ${cssFiles}`);
      console.log(`   - Total inputs: ${inputs.length}`);
    }
  } catch (error) {
    console.error('\n❌ Core build failed:', error);

    // Provide helpful error information
    if (error.message.includes('not defined')) {
      console.log('\n💡 This looks like a variable/import issue.');
      console.log('   Check that all imports are correctly resolved.');
      console.log('   Run: node scripts/prepare-core-package.mjs');
    }

    if (error.message.includes('CSS')) {
      console.log('\n💡 This looks like a CSS processing issue.');
      console.log('   Check that CSS files are being transformed correctly.');
    }

    process.exit(1);
  }
}

buildCore();
