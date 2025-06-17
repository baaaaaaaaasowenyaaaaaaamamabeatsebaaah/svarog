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
 * Parse a JavaScript file to extract export information
 * @param {string} filePath - Path to the JavaScript file
 * @returns {Object} Export information { hasDefault, defaultName, named: string[] }
 */
function parseExports(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const exports = {
      hasDefault: false,
      defaultName: null,
      named: [],
    };

    // Check for default export and try to get its name
    const defaultAsMatch = content.match(
      /export\s*{\s*default\s+as\s+(\w+)\s*}/
    );
    if (defaultAsMatch) {
      exports.hasDefault = true;
      exports.defaultName = defaultAsMatch[1];
    } else if (/export\s+default\s+/.test(content)) {
      exports.hasDefault = true;
      // Try to infer the default export name from the component directory
      const componentName = dirname(filePath).split('/').pop();
      exports.defaultName = componentName;
    }

    // Find named exports - both direct and re-exports
    // Pattern 1: export { Name1, Name2 } from './somewhere'
    const reExportPattern = /export\s*{\s*([^}]+)\s*}\s*from/g;
    let match;
    while ((match = reExportPattern.exec(content)) !== null) {
      const namedExports = match[1]
        .split(',')
        .map((exp) => exp.trim())
        .filter((exp) => exp && !exp.startsWith('default'))
        .map((exp) => {
          // Handle "Name as Alias" syntax
          const parts = exp.split(/\s+as\s+/);
          return parts[parts.length - 1];
        });
      exports.named.push(...namedExports);
    }

    // Pattern 2: export const/let/var Name = ...
    const directExportPattern =
      /export\s+(?:const|let|var|function|class)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
    while ((match = directExportPattern.exec(content)) !== null) {
      exports.named.push(match[1]);
    }

    // Pattern 3: export { Name1, Name2 } (without from)
    const namedExportPattern = /export\s*{\s*([^}]+)\s*}(?!\s*from)/g;
    while ((match = namedExportPattern.exec(content)) !== null) {
      const namedExports = match[1]
        .split(',')
        .map((exp) => exp.trim())
        .filter((exp) => exp && !exp.startsWith('default'))
        .map((exp) => {
          const parts = exp.split(/\s+as\s+/);
          return parts[parts.length - 1];
        });
      exports.named.push(...namedExports);
    }

    // Remove duplicates and filter out the default export name if it exists
    exports.named = [...new Set(exports.named)].filter(
      (name) => name !== exports.defaultName
    );

    return exports;
  } catch (error) {
    console.warn(
      `  ⚠️  Could not parse exports from ${relative(rootDir, filePath)}: ${error.message}`
    );
    return { hasDefault: true, defaultName: null, named: [] };
  }
}

/**
 * Get all exports from utility files
 * @param {string} utilsDir - Path to utils directory
 * @returns {Set<string>} Set of all utility export names
 */
function getUtilityExports(utilsDir) {
  const utilityExports = new Set();

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
  ];

  utilFiles.forEach((utilFile) => {
    const filePath = resolve(utilsDir, utilFile);
    if (existsSync(filePath)) {
      const exports = parseExports(filePath);
      if (exports.hasDefault && utilFile === 'FormContainer.js') {
        utilityExports.add('FormContainer');
      }
      exports.named.forEach((name) => utilityExports.add(name));
    }
  });

  return utilityExports;
}

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
    resolve(rootDir, 'src/utils/themeManager.js'),
    resolve(rootDir, 'src/utils/styleInjection.js'),
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
  console.log('\n📝 Generating dynamic index.js with all exports...');

  const componentsDir = resolve(corePackageDir, 'src/components');
  const utilsDir = resolve(corePackageDir, 'src/utils');

  // First, get all utility exports to check for conflicts
  const utilityExports = getUtilityExports(utilsDir);
  console.log(
    `  ℹ️  Found ${utilityExports.size} utility exports to check for conflicts`
  );

  const componentExports = [];
  let totalExports = 0;
  const conflictingExports = [];

  if (existsSync(componentsDir)) {
    const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort(); // Sort alphabetically for consistent output

    componentDirs.forEach((componentName) => {
      const componentIndexPath = resolve(
        componentsDir,
        componentName,
        'index.js'
      );

      if (existsSync(componentIndexPath)) {
        const exports = parseExports(componentIndexPath);

        // Generate export statements
        const exportStatements = [];

        if (exports.hasDefault) {
          exportStatements.push(
            `export { default as ${componentName} } from './components/${componentName}/index.js';`
          );
          totalExports++;
        }

        // Filter out named exports that conflict with utility exports
        const filteredNamedExports = exports.named.filter((name) => {
          if (utilityExports.has(name)) {
            conflictingExports.push({ component: componentName, name });
            console.log(
              `  ⚠️  Skipping ${name} from ${componentName} (conflicts with utility export)`
            );
            return false;
          }
          return true;
        });

        if (filteredNamedExports.length > 0) {
          const namedExportsStr = filteredNamedExports.join(', ');
          exportStatements.push(
            `export { ${namedExportsStr} } from './components/${componentName}/index.js';`
          );
          totalExports += filteredNamedExports.length;

          // Log components with additional named exports
          console.log(
            `  ✓ Component ${componentName} has additional named exports: ${namedExportsStr}`
          );
        }

        if (exportStatements.length > 0) {
          componentExports.push(exportStatements.join('\n'));
        }
      } else {
        console.warn(`  ⚠️  Component ${componentName} missing index.js`);
      }
    });
  }

  // Check which utilities actually exist
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

  // Add a comment about conflicting exports if any were found
  const conflictComment =
    conflictingExports.length > 0
      ? `
// Note: The following exports were skipped due to conflicts with utility exports:
${conflictingExports.map(({ component, name }) => `// - ${name} from ${component} (use the one from utils/validation.js instead)`).join('\n')}
`
      : '';

  const indexContent = `/**
 * @file Main library entry point for Svarog UI Core
 * @description Self-contained package with all copied components and utilities
 * Auto-injects base styles when imported
 */

// Auto-inject base styles when core is imported
import './styles/baseVariables.js'; // ← FIRST: CSS variables
import './styles/baseStyles.js'; // ← SECOND: Base styles that use variables

// =========================================
// COMPONENT EXPORTS (${totalExports} total exports)
// =========================================
${componentExports.join('\n')}
${conflictComment}
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
// source for development purposes.
`;

  const indexPath = resolve(corePackageDir, 'src/index.js');
  writeFileSync(indexPath, indexContent);
  console.log(
    `  ✓ Generated index.js with ${totalExports} total exports and ${availableUtils.length} utilities`
  );

  if (conflictingExports.length > 0) {
    console.log(`  ℹ️  Resolved ${conflictingExports.length} export conflicts`);
  }
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
      'getComponents.js',
      'getPrototypes.js',
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
