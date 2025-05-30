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
    resolve(rootDir, 'src/styles'), // Now required
  ];

  // Optional directories (warn if missing, don't fail)
  const optionalDirs = [resolve(rootDir, 'src/constants')];

  // Check required files
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
    resolve(corePackageDir, 'src/constants'),
    resolve(corePackageDir, 'src/styles'),
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
 * Copy and prepare base styles
 */
function prepareBaseStyles() {
  console.log('\n🎨 Copying base styles...');

  const srcStylesDir = resolve(rootDir, 'src/styles');
  const destStylesDir = resolve(corePackageDir, 'src/styles');
  mkdirSync(destStylesDir, { recursive: true });

  // Copy baseVariables.js (required)
  const srcBaseVariablesPath = resolve(srcStylesDir, 'baseVariables.js');
  const destBaseVariablesPath = resolve(destStylesDir, 'baseVariables.js');

  if (!existsSync(srcBaseVariablesPath)) {
    console.error('❌ Required file baseVariables.js not found!');
    process.exit(1);
  }

  copyFileSync(srcBaseVariablesPath, destBaseVariablesPath);
  console.log('  ✓ Copied: baseVariables.js');

  // Copy baseStyles.js (required)
  const srcBaseStylesPath = resolve(srcStylesDir, 'baseStyles.js');
  const destBaseStylesPath = resolve(destStylesDir, 'baseStyles.js');

  if (!existsSync(srcBaseStylesPath)) {
    console.error('❌ Required file baseStyles.js not found!');
    process.exit(1);
  }

  copyFileSync(srcBaseStylesPath, destBaseStylesPath);
  console.log('  ✓ Copied: baseStyles.js');

  // Copy any other style utilities (optional)
  const styleFiles = readdirSync(srcStylesDir).filter(
    (file) =>
      file.endsWith('.js') &&
      file !== 'index.js' &&
      file !== 'baseVariables.js' &&
      file !== 'baseStyles.js'
  );

  styleFiles.forEach((file) => {
    const srcPath = resolve(srcStylesDir, file);
    const destPath = resolve(destStylesDir, file);
    copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied: ${file}`);
  });
}

/**
 * Main preparation function
 */
async function prepareCore() {
  console.log('📦 Preparing svarog-ui-core package...\n');

  // VALIDATION: Check source directories and required files first
  validateSourceDirectories();

  // Clean existing directories and preserve themeManager content
  const themeManagerContent = cleanDirectories();

  // Copy components and CSS
  console.log('\n📁 Copying components and styles...');
  const srcComponentsDir = resolve(rootDir, 'src/components');
  const destComponentsDir = resolve(corePackageDir, 'src/components');

  copyRecursive(srcComponentsDir, destComponentsDir, {
    exclude: ['.test.', '.stories.'],
    include: ['.js', '.css'],
  });

  // Copy utilities
  console.log('\n🔧 Copying utilities...');
  const srcUtilsDir = resolve(rootDir, 'src/utils');
  const destUtilsDir = resolve(corePackageDir, 'src/utils');

  mkdirSync(destUtilsDir, { recursive: true });

  copyRecursive(srcUtilsDir, destUtilsDir, {
    exclude: ['testUtils', '.test.'],
    include: ['.js'],
  });

  // Copy constants
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

  // Prepare base styles (will fail if files missing)
  prepareBaseStyles();

  // Restore or ensure themeManager.js
  console.log('\n🎨 Ensuring themeManager.js...');
  const destThemeManagerPath = resolve(destUtilsDir, 'themeManager.js');

  if (themeManagerContent) {
    // Restore the preserved content
    writeFileSync(destThemeManagerPath, themeManagerContent);
    console.log('  ✓ Restored: themeManager.js');
  } else {
    // Copy from source if it exists
    const srcThemeManagerPath = resolve(rootDir, 'src/utils/themeManager.js');
    if (existsSync(srcThemeManagerPath)) {
      copyFileSync(srcThemeManagerPath, destThemeManagerPath);
      console.log('  ✓ Copied: themeManager.js from source');
    } else {
      console.error('❌ themeManager.js not found in source!');
      process.exit(1);
    }
  }

  // Create index.js if it doesn't exist in the core package
  const coreIndexPath = resolve(corePackageDir, 'src/index.js');
  if (!existsSync(coreIndexPath)) {
    // Check if there's one in source to copy
    const srcIndexPath = resolve(rootDir, 'src/core-index.js');
    if (existsSync(srcIndexPath)) {
      copyFileSync(srcIndexPath, coreIndexPath);
      console.log('  ✓ Copied: core-index.js as index.js');
    } else {
      console.error(
        '❌ Core index.js not found and no core-index.js template available!'
      );
      process.exit(1);
    }
  }

  console.log('\n✅ Core package prepared successfully!');

  // Count copied files for verification
  const componentCount = existsSync(destComponentsDir)
    ? readdirSync(destComponentsDir, { recursive: true }).filter(
        (f) => !f.name || !f.isDirectory?.()
      ).length
    : 0;
  const utilsCount = existsSync(destUtilsDir)
    ? readdirSync(destUtilsDir).length
    : 0;
  const constantsCount = existsSync(destConstantsDir)
    ? readdirSync(destConstantsDir, { recursive: true }).filter(
        (f) => !f.name || !f.isDirectory?.()
      ).length
    : 0;
  const stylesCount = existsSync(resolve(corePackageDir, 'src/styles'))
    ? readdirSync(resolve(corePackageDir, 'src/styles')).length
    : 0;

  console.log(`   📊 Components copied: ${componentCount} files`);
  console.log(`   📊 Utils copied: ${utilsCount} files`);
  console.log(`   📊 Constants copied: ${constantsCount} files`);
  console.log(`   📊 Styles copied: ${stylesCount} files`);

  // Show summary of what was created
  console.log('\n📂 Package structure created:');
  console.log('   ├── src/');
  console.log('   │   ├── components/');
  console.log('   │   ├── utils/');
  console.log('   │   │   └── themeManager.js');
  if (constantsCount > 0) {
    console.log('   │   ├── constants/');
  }
  console.log('   │   ├── styles/');
  console.log('   │   │   ├── baseVariables.js');
  console.log('   │   │   └── baseStyles.js');
  console.log('   │   └── index.js');
  console.log('   └── package.json');
}

// Run the preparation
prepareCore().catch((error) => {
  console.error('❌ Error preparing core package:', error);
  process.exit(1);
});
