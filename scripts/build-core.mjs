import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildCore() {
  console.log('🔨 Building svarog-ui-core package...\n');

  const distDir = resolve(__dirname, '../packages/svarog-ui-core/dist');
  mkdirSync(distDir, { recursive: true });

  // Read all base style files
  const baseStylesDir = resolve(__dirname, '../src/styles/base');
  const baseStyleFiles = readdirSync(baseStylesDir)
    .filter((file) => file.endsWith('.css'))
    .sort(); // Ensure they're loaded in order (00, 01, 02, etc.)

  console.log('📚 Including base styles:');
  baseStyleFiles.forEach((file) => console.log(`  - ${file}`));

  // Combine all base styles
  const baseStylesContent = baseStyleFiles
    .map((file) => {
      const content = readFileSync(resolve(baseStylesDir, file), 'utf-8');
      return `/* ${file} */\n${content}`;
    })
    .join('\n\n');

  // Create a temporary entry point that includes base styles
  const tempEntryContent = `
// Auto-generated entry point for svarog-ui-core build
import { injectStyles, css } from '../../../src/utils/styleInjection.js';

// Base styles from src/styles/base/
const baseStyles = css\`
${baseStylesContent}
\`;

// Inject base styles on first import (with high priority so themes can override)
if (typeof document !== 'undefined') {
  injectStyles('svarog-base-styles', baseStyles, { priority: 'high' });
}

// Export all components and utilities
export * from '../../../packages/svarog-ui-core/src/index.js';
`;

  const tempEntryPath = resolve(__dirname, '../.temp-core-entry.js');
  writeFileSync(tempEntryPath, tempEntryContent);

  try {
    await build({
      entryPoints: [tempEntryPath],
      bundle: true,
      outfile: resolve(distDir, 'index.js'),
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      external: ['@svarog-ui/*'],
      minify: true,
      sourcemap: false,
      alias: {
        // Map package imports to source files
        './components': resolve(__dirname, '../src/components'),
        './utils': resolve(__dirname, '../src/utils'),
      },
    });

    console.log('\n✅ Core package built successfully!');

    // Clean up temp file
    const { unlinkSync } = await import('fs');
    unlinkSync(tempEntryPath);
  } catch (error) {
    console.error('❌ Core build failed:', error);
    process.exit(1);
  }
}

buildCore();
