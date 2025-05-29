// File: scripts/prepare-core-package.mjs
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

// VALIDATION: Check source directories exist
const validateSourceDirectories = () => {
  const requiredDirs = [
    resolve(rootDir, 'src/components'),
    resolve(rootDir, 'src/utils'),
  ];

  requiredDirs.forEach((dir) => {
    if (!existsSync(dir)) {
      console.error(
        `❌ Required source directory not found: ${relative(rootDir, dir)}`
      );
      process.exit(1);
    }
  });

  console.log('✅ Source directories validated');
};

/**
 * Copy files recursively with filtering - IMPROVED VERSION
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
  const themeManagerPath = resolve(corePackageDir, 'src/utils/theme.js');
  let themeManagerContent = null;

  if (existsSync(themeManagerPath)) {
    themeManagerContent = readFileSync(themeManagerPath, 'utf-8');
    console.log('  ✓ Preserved: theme.js content');
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
 * Main preparation function - IMPROVED VERSION
 */
async function prepareCore() {
  console.log('📦 Preparing svarog-ui-core package...\n');

  // VALIDATION: Check source directories first
  validateSourceDirectories();

  // Clean existing directories and preserve themeManager content
  const themeManagerContent = cleanDirectories();

  // IMPROVED: Copy components and CSS in single pass
  console.log('\n📁 Copying components and styles...');
  const srcComponentsDir = resolve(rootDir, 'src/components');
  const destComponentsDir = resolve(corePackageDir, 'src/components');

  copyRecursive(srcComponentsDir, destComponentsDir, {
    exclude: ['.test.', '.stories.'], // Exclude test and story files
    include: ['.js', '.css'], // Include both JS and CSS in one pass
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
    console.log('\n✅ Restored: themeManager.js');
  } else {
    // themeManager.js doesn't exist, we need to ensure it's created
    console.log('\n⚠️  Warning: themeManager.js not found');
    console.log('  Run: node scripts/fix-theme-manager.mjs');
  }

  // VALIDATION: Verify core files were copied
  const coreIndexPath = resolve(corePackageDir, 'src/index.js');
  if (!existsSync(coreIndexPath)) {
    console.error('❌ Core index.js not found after preparation');
    process.exit(1);
  }

  console.log('\n✅ Core package prepared successfully!');

  // Count copied files for verification
  const componentCount = readdirSync(destComponentsDir, {
    recursive: true,
  }).length;
  const utilsCount = readdirSync(destUtilsDir).length;
  console.log(`   📊 Components copied: ${componentCount} files`);
  console.log(`   📊 Utils copied: ${utilsCount} files`);
}

// Run the preparation
prepareCore().catch((error) => {
  console.error('❌ Error preparing core package:', error);
  process.exit(1);
});
