// scripts/prepare-core-package.mjs
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
  existsSync,
  readFileSync,
  writeFileSync,
  statSync,
} from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const corePackageDir = resolve(rootDir, 'packages/svarog-ui-core');

// Files to preserve during clean
const FILES_TO_PRESERVE = ['package.json', 'README.md', 'LICENSE.md'];

/**
 * Validate source directories exist
 */
const validateSourceDirectories = () => {
  const requiredDirs = [
    resolve(rootDir, 'src/components'),
    resolve(rootDir, 'src/utils'),
    resolve(rootDir, 'src/styles'),
  ];

  const requiredFiles = [
    resolve(rootDir, 'src/styles/baseVariables.js'),
    resolve(rootDir, 'src/styles/baseStyles.js'),
    resolve(rootDir, 'src/utils/themeManager.js'), // This MUST exist
    resolve(rootDir, 'src/utils/styleInjection.js'), // This MUST exist
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

  console.log('✅ All required source files validated');
};

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
  console.log('🧹 Cleaning existing src directory...');

  const srcDir = resolve(corePackageDir, 'src');
  if (existsSync(srcDir)) {
    rmSync(srcDir, { recursive: true, force: true });
    console.log(`  ✓ Cleaned: ${relative(rootDir, srcDir)}`);
  }
}

/**
 * Copy files recursively with filtering
 */
function copyRecursive(src, dest, options = {}) {
  const { exclude = [], include = [] } = options;

  if (!existsSync(src)) {
    console.warn(`⚠️  Source directory not found: ${src}`);
    return;
  }

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
 * Generate dynamic index.js based on actual components found
 */
function generateDynamicIndex() {
  console.log('\n📝 Generating dynamic index.js...');

  const componentsDir = resolve(corePackageDir, 'src/components');
  const components = [];

  if (existsSync(componentsDir)) {
    const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    componentDirs.forEach((componentName) => {
      const componentIndexPath = resolve(
        componentsDir,
        componentName,
        'index.js'
      );
      if (existsSync(componentIndexPath)) {
        components.push(componentName);
      } else {
        console.warn(`  ⚠️  Component ${componentName} missing index.js`);
      }
    });
  }

  // Check which utilities actually exist (excluding development utilities)
  const utilsDir = resolve(corePackageDir, 'src/utils');
  const availableUtils = [];
  const utilFiles = [
    'styleInjection.js',
    'themeManager.js',
    'componentFactory.js',
    'baseComponent.js',
    'performance.js',
    'validation.js',
    'seoManager.js',
    'FormContainer.js',
    'composition.js',
    'environment.js',
    'logger.js',
    // Note: getComponents.js and getPrototypes.js are excluded - they're development utilities
  ];

  utilFiles.forEach((utilFile) => {
    if (existsSync(resolve(utilsDir, utilFile))) {
      availableUtils.push(utilFile);
    } else {
      console.warn(`  ⚠️  Utility ${utilFile} not found`);
    }
  });

  // Check constants
  const constantsDir = resolve(corePackageDir, 'src/constants');
  const hasThemesConstant = existsSync(resolve(constantsDir, 'themes.js'));

  const indexContent = `/**
 * @file Main library entry point for Svarog UI Core
 * @description Self-contained package with all copied components and utilities
 * Auto-injects base styles when imported
 */

// Auto-inject base styles when core is imported
import './styles/baseStyles.js';

// =========================================
// COMPONENT EXPORTS (${components.length} components found)
// =========================================
${components
  .map(
    (component) =>
      `export { default as ${component} } from './components/${component}/index.js';`
  )
  .join('\n')}

// =========================================
// UTILITY EXPORTS
// =========================================

// Style injection utilities
export {
  injectStyles,
  css,
  createStyleInjector,
  removeStyles,
} from './utils/styleInjection.js';

// Theme management (using copied themeManager with all functions)
export {
  themeManager,
  getThemeNames,
  switchTheme,
  getCurrentTheme,
  setThemeVariable,
  loadTheme,
  loadCustomTheme,
  checkRequiredVariables,
  onThemeChange,
} from './utils/themeManager.js';

// Component factory utilities
export {
  createElement,
  appendChildren,
  createComponent,
  validateProps,
} from './utils/componentFactory.js';

// Base utilities
export { createBaseComponent } from './utils/baseComponent.js';

// Performance utilities
export {
  debounce,
  throttle,
  rafThrottle,
  memoize,
  batchDomUpdates,
  runWhenIdle,
  PerformanceBenchmark,
} from './utils/performance.js';

// Validation utilities
export { validateInput, validateRequiredProps } from './utils/validation.js';

// SEO utilities
export {
  validateSEO,
  generateSlug,
  optimizeSEO,
  generateStructuredData,
  extractSEOFromCMS,
} from './utils/seoManager.js';

// Form utilities
export { default as FormContainer } from './utils/FormContainer.js';

// Higher-order component utilities
export {
  withBehavior,
  withThemeAwareness,
  withEventDelegation,
} from './utils/composition.js';

// Environment utilities
export { isTestEnvironment } from './utils/environment.js';

// Logger
export { logger } from './utils/logger.js';

// =========================================
// CONSTANTS
// =========================================
${hasThemesConstant ? `export { THEMES } from './constants/themes.js';` : `// THEMES constant not available`}

// Note: Development utilities like getComponents and getPrototypes are not included
// in the core package to avoid .stories.js dependencies. Use them from the main
// source for development purposes.`;

  const indexPath = resolve(corePackageDir, 'src/index.js');
  writeFileSync(indexPath, indexContent);
  console.log(
    `  ✓ Generated index.js with ${components.length} components and ${availableUtils.length} utilities`
  );
}

/**
 * Get file size in a human readable format
 */
function getFileSize(filePath) {
  const stats = statSync(filePath);
  const bytes = stats.size;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Main preparation function
 */
async function prepareCore() {
  console.log('📦 Preparing svarog-ui-core package...\n');

  // 1. Validate source directories first
  validateSourceDirectories();

  // 2. Preserve important files
  const preservedFiles = preserveFiles();

  // 3. Clean existing directories
  cleanDirectories();

  // 4. Copy components
  console.log('\n📁 Copying components...');
  const srcComponentsDir = resolve(rootDir, 'src/components');
  const destComponentsDir = resolve(corePackageDir, 'src/components');

  copyRecursive(srcComponentsDir, destComponentsDir, {
    exclude: ['.test.', '.stories.', '.spec.', '__tests__'],
    include: ['.js', '.css'],
  });

  // 5. Copy ALL utilities (excluding development utilities)
  console.log('\n🔧 Copying utilities...');
  const srcUtilsDir = resolve(rootDir, 'src/utils');
  const destUtilsDir = resolve(corePackageDir, 'src/utils');

  copyRecursive(srcUtilsDir, destUtilsDir, {
    exclude: [
      'testUtils',
      '.test.',
      '.spec.',
      '__tests__',
      'getComponents.js', // Development utility - exclude from core
      'getPrototypes.js', // Development utility - exclude from core
    ],
    include: ['.js'],
  });

  // 6. Copy constants
  console.log('\n📋 Copying constants...');
  const srcConstantsDir = resolve(rootDir, 'src/constants');
  const destConstantsDir = resolve(corePackageDir, 'src/constants');

  if (existsSync(srcConstantsDir)) {
    copyRecursive(srcConstantsDir, destConstantsDir, {
      exclude: ['.test.', '.stories.', '__tests__'],
      include: ['.js', '.json'],
    });
  } else {
    console.log('  ⚠️  src/constants directory not found, skipping...');
  }

  // 7. Copy styles
  console.log('\n🎨 Copying styles...');
  const srcStylesDir = resolve(rootDir, 'src/styles');
  const destStylesDir = resolve(corePackageDir, 'src/styles');

  copyRecursive(srcStylesDir, destStylesDir, {
    exclude: ['.test.', '.stories.', '__tests__'],
    include: ['.js', '.css'],
  });

  // 8. Generate the dynamic index.js
  generateDynamicIndex();

  // 9. Restore preserved files
  restoreFiles(preservedFiles);

  console.log('\n✅ Core package prepared successfully!');

  // 10. Show summary
  const summary = {
    components: existsSync(resolve(corePackageDir, 'src/components'))
      ? readdirSync(resolve(corePackageDir, 'src/components')).filter((item) =>
          statSync(
            resolve(corePackageDir, 'src/components', item)
          ).isDirectory()
        ).length
      : 0,
    utilities: existsSync(resolve(corePackageDir, 'src/utils'))
      ? readdirSync(resolve(corePackageDir, 'src/utils')).filter((f) =>
          f.endsWith('.js')
        ).length
      : 0,
    styles: existsSync(resolve(corePackageDir, 'src/styles'))
      ? readdirSync(resolve(corePackageDir, 'src/styles')).filter((f) =>
          f.endsWith('.js')
        ).length
      : 0,
    constants: existsSync(resolve(corePackageDir, 'src/constants'))
      ? readdirSync(resolve(corePackageDir, 'src/constants')).filter((f) =>
          f.endsWith('.js')
        ).length
      : 0,
  };

  console.log(`\n📊 Summary:`);
  console.log(`   Components: ${summary.components} directories`);
  console.log(`   Utilities: ${summary.utilities} files`);
  console.log(`   Styles: ${summary.styles} files`);
  console.log(`   Constants: ${summary.constants} files`);

  // Check index.js size
  const indexPath = resolve(corePackageDir, 'src/index.js');
  if (existsSync(indexPath)) {
    console.log(`   Index.js: ${getFileSize(indexPath)}`);
  }

  // Verify critical files exist
  console.log(`\n🔍 Critical file verification:`);
  const criticalFiles = [
    'src/index.js',
    'src/utils/themeManager.js',
    'src/utils/styleInjection.js',
    'src/styles/baseStyles.js',
    'src/styles/baseVariables.js',
  ];

  criticalFiles.forEach((file) => {
    const filePath = resolve(corePackageDir, file);
    const exists = existsSync(filePath);
    console.log(
      `   ${exists ? '✅' : '❌'} ${file} ${exists ? `(${getFileSize(filePath)})` : '(missing)'}`
    );
  });

  console.log(
    '\n📝 Note: Development utilities (getComponents.js, getPrototypes.js) are'
  );
  console.log(
    '   excluded from core package to avoid .stories.js dependencies.'
  );

  console.log('\n🎯 Next steps:');
  console.log('   1. Run: npm run build:core');
  console.log('   2. Test: cd packages/svarog-ui-core && npm pack');
  console.log('   3. Verify: tar -tzf svarog-ui-core-*.tgz');
  console.log('   4. Publish: npm publish');
}

// Run the preparation
prepareCore().catch((error) => {
  console.error('❌ Error preparing core package:', error);
  process.exit(1);
});
