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

  // Optional directories (warn if missing, don't fail)
  const optionalDirs = [resolve(rootDir, 'src/constants')];

  requiredDirs.forEach((dir) => {
    if (!existsSync(dir)) {
      console.error(
        `❌ Required source directory not found: ${relative(rootDir, dir)}`
      );
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
  const themeManagerPath = resolve(corePackageDir, 'src/utils/themeManager.js');
  let themeManagerContent = null;

  if (existsSync(themeManagerPath)) {
    themeManagerContent = readFileSync(themeManagerPath, 'utf-8');
    console.log('  ✓ Preserved: themeManager.js content');
  }

  const dirsToClean = [
    resolve(corePackageDir, 'src/components'),
    resolve(corePackageDir, 'src/utils'),
    resolve(corePackageDir, 'src/constants'), // Added constants cleanup
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
 * Ensure themeManager.js exists with proper content
 */
function ensureThemeManager(destUtilsDir, preservedContent) {
  const themeManagerPath = resolve(destUtilsDir, 'themeManager.js');

  if (preservedContent) {
    // Restore the preserved content
    writeFileSync(themeManagerPath, preservedContent);
    console.log('✅ Restored: themeManager.js');
    return;
  }

  // Check if it was copied from source
  if (existsSync(themeManagerPath)) {
    console.log('✅ Found: themeManager.js (copied from source)');
    return;
  }

  // Create default themeManager.js
  console.log('⚠️  themeManager.js not found, creating default...');

  const defaultThemeManagerContent = `// Auto-generated themeManager.js
const themes = new Map();
let currentTheme = null;

/**
 * Theme Manager for Svarog UI
 * Manages theme registration, switching, and state
 */
export const ThemeManager = {
  /**
   * Register a theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme object with apply/remove methods
   */
  register(name, theme) {
    if (!theme || typeof theme.apply !== 'function') {
      throw new Error(\`Invalid theme: \${name}. Theme must have apply() method.\`);
    }

    themes.set(name, theme);
    console.log(\`✓ Registered theme: \${name}\`);
  },

  /**
   * Switch to a theme
   * @param {string} name - Theme name to switch to
   */
  switch(name) {
    const theme = themes.get(name);

    if (!theme) {
      console.error(\`Theme "\${name}" not found. Available themes:\`, Array.from(themes.keys()));
      return false;
    }

    // Remove current theme if exists
    if (currentTheme && typeof currentTheme.remove === 'function') {
      currentTheme.remove();
    }

    // Apply new theme
    theme.apply();
    currentTheme = theme;

    console.log(\`✓ Switched to theme: \${name}\`);
    return true;
  },

  /**
   * Get current active theme
   * @returns {Object|null} Current theme object
   */
  getCurrent() {
    return currentTheme;
  },

  /**
   * Get all registered themes
   * @returns {Array<string>} Array of theme names
   */
  getRegistered() {
    return Array.from(themes.keys());
  },

  /**
   * Remove a theme
   * @param {string} name - Theme name to remove
   */
  unregister(name) {
    if (currentTheme === themes.get(name)) {
      if (typeof currentTheme.remove === 'function') {
        currentTheme.remove();
      }
      currentTheme = null;
    }

    themes.delete(name);
    console.log(\`✓ Unregistered theme: \${name}\`);
  }
};

// Convenience exports for backward compatibility
export const registerTheme = ThemeManager.register.bind(ThemeManager);
export const switchTheme = ThemeManager.switch.bind(ThemeManager);
export const getCurrentTheme = ThemeManager.getCurrent.bind(ThemeManager);
`;

  writeFileSync(themeManagerPath, defaultThemeManagerContent);
  console.log('✅ Created: themeManager.js');
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
    exclude: ['testUtils', '.test.'],
    include: ['.js'],
  });

  // NEW: Copy constants folder
  console.log('\n📋 Copying constants...');
  const srcConstantsDir = resolve(rootDir, 'src/constants');
  const destConstantsDir = resolve(corePackageDir, 'src/constants');

  if (existsSync(srcConstantsDir)) {
    copyRecursive(srcConstantsDir, destConstantsDir, {
      exclude: ['.test.', '.stories.'], // Exclude test files
      include: ['.js', '.json'], // Include JS and JSON files
    });
  } else {
    console.log('  ⚠️  src/constants directory not found, skipping...');
  }

  // Ensure themeManager.js exists
  console.log('\n🎨 Ensuring themeManager.js...');
  ensureThemeManager(destUtilsDir, themeManagerContent);

  // VALIDATION: Verify core files were copied
  const coreIndexPath = resolve(corePackageDir, 'src/index.js');
  if (!existsSync(coreIndexPath)) {
    console.error('❌ Core index.js not found after preparation');
    process.exit(1);
  }

  console.log('\n✅ Core package prepared successfully!');

  // Count copied files for verification
  const componentCount = existsSync(destComponentsDir)
    ? readdirSync(destComponentsDir, { recursive: true }).length
    : 0;
  const utilsCount = existsSync(destUtilsDir)
    ? readdirSync(destUtilsDir).length
    : 0;
  const constantsCount = existsSync(destConstantsDir)
    ? readdirSync(destConstantsDir, { recursive: true }).length
    : 0;

  console.log(`   📊 Components copied: ${componentCount} files`);
  console.log(`   📊 Utils copied: ${utilsCount} files`);
  console.log(`   📊 Constants copied: ${constantsCount} files`);

  // Show summary of what was created
  console.log('\n📂 Package structure created:');
  console.log('   ├── src/');
  console.log('   │   ├── components/');
  console.log('   │   ├── utils/');
  if (constantsCount > 0) {
    console.log('   │   ├── constants/');
  }
  console.log('   │   └── index.js');
  console.log('   └── package.json');
}

// Run the preparation
prepareCore().catch((error) => {
  console.error('❌ Error preparing core package:', error);
  process.exit(1);
});
