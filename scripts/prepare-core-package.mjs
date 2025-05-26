import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const corePackageDir = resolve(rootDir, 'packages/svarog-ui-core');

/**
 * Copy files recursively with filtering
 */
function copyRecursive(src, dest, options = {}) {
  const { exclude = [], include = [] } = options;

  mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    // Check exclusions
    if (exclude.some((pattern) => entry.name.includes(pattern))) {
      continue;
    }

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath, options);
    } else if (entry.isFile()) {
      // Check inclusions
      const shouldInclude =
        include.length === 0 || include.some((ext) => entry.name.endsWith(ext));

      if (shouldInclude) {
        copyFileSync(srcPath, destPath);
        console.log(`  ✓ Copied: ${relative(rootDir, srcPath)}`);
      }
    }
  }
}

/**
 * Clean destination directories
 */
function cleanDirectories() {
  console.log('🧹 Cleaning existing directories...');

  // First, preserve themeManager.js if it exists
  const themeManagerPath = resolve(corePackageDir, 'src/utils/themeManager.js');
  let themeManagerContent = null;

  if (existsSync(themeManagerPath)) {
    themeManagerContent = readFileSync(themeManagerPath, 'utf-8');
    console.log('  ✓ Preserved: themeManager.js content');
  }

  const dirsToClean = [
    resolve(corePackageDir, 'src/components'),
    resolve(corePackageDir, 'src/utils'),
  ];

  dirsToClean.forEach((dir) => {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`  ✓ Cleaned: ${relative(rootDir, dir)}`);
    }
  });

  return themeManagerContent;
}

/**
 * Main preparation function
 */
async function prepareCore() {
  console.log('📦 Preparing svarog-ui-core package...\n');

  // Clean existing directories and preserve themeManager content
  const themeManagerContent = cleanDirectories();

  // Copy components
  console.log('\n📁 Copying components...');
  const srcComponentsDir = resolve(rootDir, 'src/components');
  const destComponentsDir = resolve(corePackageDir, 'src/components');

  copyRecursive(srcComponentsDir, destComponentsDir, {
    exclude: ['.test.', '.stories.', '.css'],
    include: ['.js'],
  });

  // Copy CSS files separately (we need these for style injection)
  console.log('\n🎨 Copying component styles...');
  copyRecursive(srcComponentsDir, destComponentsDir, {
    exclude: ['.test.', '.stories.'],
    include: ['.css'],
  });

  // Copy utilities
  console.log('\n🔧 Copying utilities...');
  const srcUtilsDir = resolve(rootDir, 'src/utils');
  const destUtilsDir = resolve(corePackageDir, 'src/utils');

  // Create utils directory
  mkdirSync(destUtilsDir, { recursive: true });

  // Don't copy test utilities or theme-specific utilities
  copyRecursive(srcUtilsDir, destUtilsDir, {
    exclude: ['testUtils', 'theme.js', '.test.'],
    include: ['.js'],
  });

  // Restore or ensure themeManager.js exists
  const themeManagerPath = resolve(destUtilsDir, 'themeManager.js');

  if (themeManagerContent) {
    // Restore the preserved content
    writeFileSync(themeManagerPath, themeManagerContent);
    console.log('\n✓ Restored: themeManager.js');
  } else {
    // themeManager.js doesn't exist, we need to ensure it's created
    console.log('\n⚠️  Warning: themeManager.js not found');
    console.log('  Run: node scripts/fix-theme-manager.mjs');
  }

  console.log('\n✅ Core package prepared successfully!');
}

// Run the preparation
prepareCore().catch((error) => {
  console.error('❌ Error preparing core package:', error);
  process.exit(1);
});
