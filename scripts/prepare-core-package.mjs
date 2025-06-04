// scripts/prepare-core-package.mjs
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

// Files to preserve during clean
const FILES_TO_PRESERVE = [
  'src/utils/themeManager.js',
  'src/index.js',
  'package.json',
  'README.md',
  'LICENSE.md',
];

/**
 * Validate source directories exist
 */
const validateSourceDirectories = () => {
  const requiredDirs = [
    resolve(rootDir, 'src/components'),
    resolve(rootDir, 'src/utils'),
    resolve(rootDir, 'src/styles'),
  ];

  const optionalDirs = [resolve(rootDir, 'src/constants')];

  const requiredFiles = [
    resolve(rootDir, 'src/styles/baseVariables.js'),
    resolve(rootDir, 'src/styles/baseStyles.js'),
  ];

  requiredDirs.forEach((dir) => {
    if (!existsSync(dir)) {
      console.error(
        `❌ Required source directory not found: ${relative(rootDir, dir)}`
      );
      process.exit(1);
    }
  });

  requiredFiles.forEach((file) => {
    if (!existsSync(file)) {
      console.error(`❌ Required file not found: ${relative(rootDir, file)}`);
      process.exit(1);
    }
  });

  optionalDirs.forEach((dir) => {
    if (!existsSync(dir)) {
      console.warn(
        `⚠️  Optional directory not found: ${relative(rootDir, dir)}`
      );
    }
  });

  console.log('✅ Source directories and required files validated');
};

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
 * Preserve important files before cleaning
 */
function preserveFiles() {
  console.log('📦 Preserving important files...');

  const preserved = {};

  FILES_TO_PRESERVE.forEach((file) => {
    const filePath = resolve(corePackageDir, file);
    if (existsSync(filePath)) {
      preserved[file] = readFileSync(filePath, 'utf-8');
      console.log(`  ✓ Preserved: ${file}`);
    }
  });

  return preserved;
}

/**
 * Restore preserved files
 */
function restoreFiles(preserved) {
  console.log('\n📦 Restoring preserved files...');

  Object.entries(preserved).forEach(([file, content]) => {
    const filePath = resolve(corePackageDir, file);
    const dir = dirname(filePath);

    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, content);
    console.log(`  ✓ Restored: ${file}`);
  });
}

/**
 * Clean destination directories
 */
function cleanDirectories() {
  console.log('🧹 Cleaning existing directories...');

  const dirsToClean = [
    resolve(corePackageDir, 'src/components'),
    resolve(corePackageDir, 'src/utils'),
    resolve(corePackageDir, 'src/constants'),
    resolve(corePackageDir, 'src/styles'),
  ];

  dirsToClean.forEach((dir) => {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`  ✓ Cleaned: ${relative(rootDir, dir)}`);
    }
  });
}

/**
 * Copy and prepare base styles
 */
function prepareBaseStyles() {
  console.log('\n🎨 Copying base styles...');

  const srcStylesDir = resolve(rootDir, 'src/styles');
  const destStylesDir = resolve(corePackageDir, 'src/styles');
  mkdirSync(destStylesDir, { recursive: true });

  // Copy required style files
  const requiredStyleFiles = ['baseVariables.js', 'baseStyles.js'];

  requiredStyleFiles.forEach((file) => {
    const srcPath = resolve(srcStylesDir, file);
    const destPath = resolve(destStylesDir, file);

    if (!existsSync(srcPath)) {
      console.error(`❌ Required file ${file} not found!`);
      process.exit(1);
    }

    copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied: ${file}`);
  });

  // Copy any other style utilities (optional)
  const styleFiles = readdirSync(srcStylesDir).filter(
    (file) =>
      file.endsWith('.js') &&
      file !== 'index.js' &&
      !requiredStyleFiles.includes(file)
  );

  styleFiles.forEach((file) => {
    const srcPath = resolve(srcStylesDir, file);
    const destPath = resolve(destStylesDir, file);
    copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied: ${file}`);
  });
}

/**
 * Create or ensure core index.js exists
 */
function ensureCoreIndex(preservedFiles) {
  const coreIndexPath = resolve(corePackageDir, 'src/index.js');

  // Check if we already have the index.js content from preserved files
  if (preservedFiles['src/index.js']) {
    console.log('  ✓ Core index.js already restored from preserved files');
    return;
  }

  // Check if the actual core package index.js exists
  const existingCoreIndex = resolve(
    rootDir,
    'packages/svarog-ui-core/src/index.js'
  );
  if (existsSync(existingCoreIndex)) {
    console.log('  ✓ Core index.js already exists');
    return;
  }

  // Check for a template file
  const templatePath = resolve(rootDir, 'src/core-index.js');
  if (existsSync(templatePath)) {
    copyFileSync(templatePath, coreIndexPath);
    console.log('  ✓ Created index.js from core-index.js template');
    return;
  }

  // Create a basic index.js that re-exports from the main src/index.js
  console.log('  ✓ Creating basic core index.js');
  const basicIndex = `/**
 * @file Main library entry point for Svarog UI Core
 * @description Provides both individual and categorized component exports
 * Auto-injects base styles when imported
 */

// Auto-inject base styles when core is imported
import './styles/baseStyles.js';

// Re-export all components and utilities from main index
export * from '../../../src/index.js';
`;

  mkdirSync(dirname(coreIndexPath), { recursive: true });
  writeFileSync(coreIndexPath, basicIndex);
  console.log('  ✓ Created basic core index.js');
}

/**
 * Main preparation function
 */
async function prepareCore() {
  console.log('📦 Preparing svarog-ui-core package...\n');

  // Validate source directories first
  validateSourceDirectories();

  // Preserve important files
  const preservedFiles = preserveFiles();

  // Clean existing directories
  cleanDirectories();

  // Copy components
  console.log('\n📁 Copying components...');
  const srcComponentsDir = resolve(rootDir, 'src/components');
  const destComponentsDir = resolve(corePackageDir, 'src/components');

  copyRecursive(srcComponentsDir, destComponentsDir, {
    exclude: ['.test.', '.stories.', '.spec.'],
    include: ['.js', '.css'],
  });

  // Copy utilities
  console.log('\n🔧 Copying utilities...');
  const srcUtilsDir = resolve(rootDir, 'src/utils');
  const destUtilsDir = resolve(corePackageDir, 'src/utils');

  mkdirSync(destUtilsDir, { recursive: true });

  copyRecursive(srcUtilsDir, destUtilsDir, {
    exclude: ['testUtils', '.test.', '.spec.'],
    include: ['.js'],
  });

  // Copy constants if they exist
  console.log('\n📋 Copying constants...');
  const srcConstantsDir = resolve(rootDir, 'src/constants');
  const destConstantsDir = resolve(corePackageDir, 'src/constants');

  if (existsSync(srcConstantsDir)) {
    copyRecursive(srcConstantsDir, destConstantsDir, {
      exclude: ['.test.', '.stories.'],
      include: ['.js', '.json'],
    });
  } else {
    console.log('  ⚠️  src/constants directory not found, skipping...');
  }

  // Prepare base styles
  prepareBaseStyles();

  // Restore preserved files
  restoreFiles(preservedFiles);

  // Ensure core index.js exists
  ensureCoreIndex(preservedFiles);

  console.log('\n✅ Core package prepared successfully!');

  // Show summary
  const componentCount = readdirSync(destComponentsDir, {
    recursive: true,
  }).filter((entry) =>
    typeof entry === 'string' ? entry.endsWith('.js') : !entry.isDirectory()
  ).length;
  const utilsCount = readdirSync(destUtilsDir).filter((f) =>
    f.endsWith('.js')
  ).length;
  const stylesCount = readdirSync(resolve(corePackageDir, 'src/styles')).filter(
    (f) => f.endsWith('.js')
  ).length;

  console.log(`\n📊 Summary:`);
  console.log(`   Components: ${componentCount} files`);
  console.log(`   Utils: ${utilsCount} files`);
  console.log(`   Styles: ${stylesCount} files`);
}

// Run the preparation
prepareCore().catch((error) => {
  console.error('❌ Error preparing core package:', error);
  process.exit(1);
});
