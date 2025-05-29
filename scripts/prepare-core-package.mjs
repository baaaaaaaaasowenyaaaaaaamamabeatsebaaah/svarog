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
 * Copy files recursively WITHOUT transformation
 * The transformation was causing syntax errors
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
        // SIMPLE COPY - NO TRANSFORMATION
        copyFileSync(srcPath, destPath);
        console.log(`  ✓ Copied: ${relative(rootDir, srcPath)}`);
      }
    }
  }
}

/**
 * Generate CSS modules as JavaScript files with better error handling
 */
function generateCSSModules(srcDir, destDir) {
  const entries = readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name);

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      generateCSSModules(srcPath, destPath);
    } else if (entry.name.endsWith('.css')) {
      const cssContent = readFileSync(srcPath, 'utf-8');
      const jsPath = destPath.replace('.css', '.css.js');

      // Create JavaScript module that exports CSS as string
      // Use JSON.stringify to properly escape the CSS
      const jsContent = `// Auto-generated CSS module for ${entry.name}
export default ${JSON.stringify(cssContent)};
`;

      writeFileSync(jsPath, jsContent);
      console.log(`  ✓ Generated CSS module: ${relative(rootDir, jsPath)}`);
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
 * Create the main index.js for the core package
 */
function createCoreIndex() {
  console.log('\n📝 Creating core package index...');

  const srcComponentsDir = resolve(rootDir, 'src/components');
  const components = readdirSync(srcComponentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(); // Sort for consistent output

  const indexContent = `// Auto-generated core package index
// Components (${components.length} total)
${components
  .map(
    (component) =>
      `export { default as ${component} } from './components/${component}/index.js';`
  )
  .join('\n')}

// Utilities
export * from './utils/styleInjection.js';
export * from './utils/componentFactory.js';
export * from './utils/baseComponent.js';
export * from './utils/composition.js';
export * from './utils/validation.js';
export * from './utils/performance.js';

// Theme manager
export {
  ThemeManager,
  registerTheme,
  switchTheme,
  getCurrentTheme,
} from './utils/themeManager.js';

// Debug utilities (for development)
export { debugStyleInjection, getInjectedStyles } from './utils/styleInjection.js';

// Default export for convenience
const SvarogCore = {
  // Components
  ${components.map((component) => `  ${component},`).join('\n')}
  
  // Utilities
  ThemeManager,
  registerTheme,
  switchTheme,
  getCurrentTheme,
};

export default SvarogCore;
`;

  const indexPath = resolve(corePackageDir, 'src/index.js');
  writeFileSync(indexPath, indexContent);
  console.log(`  ✓ Created: ${relative(rootDir, indexPath)}`);
  console.log(`  ✓ Exported ${components.length} components`);
}

/**
 * Main preparation function - SIMPLIFIED
 */
async function prepareCore() {
  console.log('📦 Preparing svarog-ui-core package...\n');

  // Clean existing directories and preserve themeManager content
  const themeManagerContent = cleanDirectories();

  // Copy components WITHOUT transformation (this was causing the errors)
  console.log('\n📁 Copying components...');
  const srcComponentsDir = resolve(rootDir, 'src/components');
  const destComponentsDir = resolve(corePackageDir, 'src/components');

  copyRecursive(srcComponentsDir, destComponentsDir, {
    exclude: ['.test.', '.stories.', '.css'],
    include: ['.js'],
  });

  // Generate CSS modules from CSS files
  console.log('\n🎨 Generating CSS modules...');
  generateCSSModules(srcComponentsDir, destComponentsDir);

  // Copy utilities WITHOUT transformation
  console.log('\n🔧 Copying utilities...');
  const srcUtilsDir = resolve(rootDir, 'src/utils');
  const destUtilsDir = resolve(corePackageDir, 'src/utils');

  // Create utils directory
  mkdirSync(destUtilsDir, { recursive: true });

  // Copy utilities, excluding test and theme-specific files
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
    // Create a minimal themeManager if it doesn't exist
    const minimalThemeManager = `/**
 * Core Theme Manager - handles theme registration and switching
 * @module themeManager
 */

class CoreThemeManager {
  constructor() {
    this.themes = new Map();
    this.currentTheme = null;
    this.observers = new Set();
  }

  /**
   * Register a theme
   * @param {string} name - Theme name
   * @param {Object} theme - Theme object with apply() method
   */
  register(name, theme) {
    if (!theme || typeof theme.apply !== 'function') {
      throw new Error(\`Theme "\${name}" must have an apply() method\`);
    }
    this.themes.set(name, theme);
    
    // Auto-apply first theme
    if (this.themes.size === 1 && !this.currentTheme) {
      this.switch(name);
    }
  }

  /**
   * Switch to a registered theme
   * @param {string} name - Theme name
   */
  switch(name) {
    const theme = this.themes.get(name);
    if (!theme) {
      throw new Error(\`Theme "\${name}" is not registered\`);
    }
    
    // Remove current theme if exists
    if (this.currentTheme && this.currentTheme !== name) {
      const currentThemeObj = this.themes.get(this.currentTheme);
      if (currentThemeObj && typeof currentThemeObj.remove === 'function') {
        currentThemeObj.remove();
      }
    }
    
    theme.apply();
    this.currentTheme = name;
    
    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme: name }
      }));
    }
  }

  /**
   * Get current theme name
   * @returns {string|null}
   */
  getCurrent() {
    return this.currentTheme;
  }

  /**
   * Get all registered theme names
   * @returns {string[]}
   */
  getRegistered() {
    return Array.from(this.themes.keys());
  }
}

// Export singleton instance
export const ThemeManager = new CoreThemeManager();

// Export convenience functions
export const registerTheme = (name, theme) => ThemeManager.register(name, theme);
export const switchTheme = (name) => ThemeManager.switch(name);
export const getCurrentTheme = () => ThemeManager.getCurrent();
`;

    writeFileSync(themeManagerPath, minimalThemeManager);
    console.log('\n✓ Created: themeManager.js');
  }

  // Create the main index file
  createCoreIndex();

  console.log('\n✅ Core package prepared successfully!');
  console.log('\n📊 Package contents:');

  // Count files
  const componentDirs = readdirSync(resolve(corePackageDir, 'src/components'), {
    recursive: true,
  });
  const utilFiles = readdirSync(resolve(corePackageDir, 'src/utils'));

  console.log(
    `   - Component files: ${componentDirs.filter((f) => f.endsWith('.js')).length}`
  );
  console.log(
    `   - CSS modules: ${componentDirs.filter((f) => f.endsWith('.css.js')).length}`
  );
  console.log(`   - Utility files: ${utilFiles.length}`);

  console.log('\nNext steps:');
  console.log('1. Run: npm run build:core');
  console.log('2. Files should now build without syntax errors');
}

// Run the preparation
prepareCore().catch((error) => {
  console.error('❌ Error preparing core package:', error);
  process.exit(1);
});
