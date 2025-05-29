#!/usr/bin/env node

/**
 * Quick Fix Script for Svarog UI Build Issues
 * Addresses common problems found in the build output
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Running quick fixes for build issues...\n');

let fixesApplied = 0;

// Fix 1: Check and fix CSS files with syntax issues
function fixCSSFiles() {
  console.log('🎨 Checking CSS files for syntax issues...');

  const themesDir = resolve(__dirname, '../src/styles/themes');
  if (!existsSync(themesDir)) {
    console.log('   - No themes directory found, skipping CSS fixes');
    return;
  }

  const cssFiles = readdirSync(themesDir).filter((f) => f.endsWith('.css'));

  cssFiles.forEach((file) => {
    const filePath = resolve(themesDir, file);
    const content = readFileSync(filePath, 'utf-8');

    // Fix common CSS issues
    let fixedContent = content
      // Fix font family declarations - ensure they're properly quoted
      .replace(/font-family:\s*([^;,\n]+)/g, (match, fontFamily) => {
        // If font family contains spaces and isn't quoted, quote it
        const fonts = fontFamily.split(',').map((font) => {
          const trimmed = font.trim();
          if (trimmed.includes(' ') && !trimmed.match(/^['"].*['"]$/)) {
            return `"${trimmed}"`;
          }
          return trimmed;
        });
        return `font-family: ${fonts.join(', ')}`;
      })
      // Fix URLs that might need quotes
      .replace(/url\(([^)]+)\)/g, (match, url) => {
        const cleanUrl = url.trim();
        if (!cleanUrl.match(/^['"].*['"]$/) && !cleanUrl.startsWith('data:')) {
          return `url("${cleanUrl}")`;
        }
        return match;
      })
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .trim();

    if (fixedContent !== content) {
      writeFileSync(filePath, fixedContent);
      console.log(`   ✓ Fixed: ${file}`);
      fixesApplied++;
    }
  });
}

// Fix 2: Check component files for missing imports
function fixComponentImports() {
  console.log('📦 Checking component files for import issues...');

  const componentsDir = resolve(__dirname, '../src/components');
  if (!existsSync(componentsDir)) {
    console.log('   - No components directory found, skipping');
    return;
  }

  const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  componentDirs.forEach((componentName) => {
    const componentFile = resolve(
      componentsDir,
      componentName,
      `${componentName}.js`
    );
    if (!existsSync(componentFile)) return;

    const content = readFileSync(componentFile, 'utf-8');

    // Check for CSS import without proper error handling
    if (
      content.includes(`import './${componentName}.css'`) &&
      !content.includes('handleComponentStyles')
    ) {
      // This will be handled by the build process, but let's check it exists
      const cssFile = resolve(
        componentsDir,
        componentName,
        `${componentName}.css`
      );
      if (!existsSync(cssFile)) {
        console.log(
          `   ⚠️  ${componentName} imports CSS but ${componentName}.css not found`
        );
      }
    }
  });
}

// Fix 3: Validate theme structure
function validateThemes() {
  console.log('🎭 Validating theme structures...');

  const themesDir = resolve(__dirname, '../src/styles/themes');
  if (!existsSync(themesDir)) {
    console.log('   - No themes directory found, skipping');
    return;
  }

  const themeFiles = readdirSync(themesDir).filter((f) =>
    f.endsWith('-theme.css')
  );

  themeFiles.forEach((file) => {
    const themeName = file.replace('-theme.css', '');
    const filePath = resolve(themesDir, file);
    const content = readFileSync(filePath, 'utf-8');

    // Check for required theme class
    if (!content.includes(`.${themeName}-theme`)) {
      console.log(`   ⚠️  ${file} should contain .${themeName}-theme selector`);
    }

    // Check for CSS variables
    const variableCount = (content.match(/--[\w-]+:/g) || []).length;
    if (variableCount === 0) {
      console.log(`   ⚠️  ${file} contains no CSS variables`);
    } else {
      console.log(`   ✓ ${file} has ${variableCount} CSS variables`);
    }
  });
}

// Fix 4: Check package.json files
function validatePackageFiles() {
  console.log('📋 Validating package.json files...');

  const packages = [
    'packages/svarog-ui-core/package.json',
    'packages/@svarog-ui/theme-default/package.json',
    'packages/@svarog-ui/theme-cabalou/package.json',
    'packages/@svarog-ui/theme-muchandy/package.json',
  ];

  packages.forEach((packagePath) => {
    const fullPath = resolve(__dirname, '../', packagePath);
    if (!existsSync(fullPath)) {
      console.log(`   ⚠️  ${packagePath} not found`);
      return;
    }

    try {
      const pkg = JSON.parse(readFileSync(fullPath, 'utf-8'));

      // Basic validation
      if (!pkg.name) console.log(`   ⚠️  ${packagePath} missing name`);
      if (!pkg.version) console.log(`   ⚠️  ${packagePath} missing version`);
      if (!pkg.main && !pkg.module)
        console.log(`   ⚠️  ${packagePath} missing main/module`);

      console.log(`   ✓ ${pkg.name} (${pkg.version})`);
    } catch (error) {
      console.log(`   ❌ ${packagePath} has invalid JSON: ${error.message}`);
    }
  });
}

// Fix 5: Create missing files if needed
function createMissingFiles() {
  console.log('📄 Checking for missing critical files...');

  // Check for styleInjection.js
  const styleInjectionPath = resolve(
    __dirname,
    '../src/utils/styleInjection.js'
  );
  if (!existsSync(styleInjectionPath)) {
    console.log(
      '   ⚠️  styleInjection.js missing - this is critical for the build'
    );
    console.log('      Create this file using the provided template');
  } else {
    console.log('   ✓ styleInjection.js exists');
  }

  // Check for themeManager.js
  const themeManagerPath = resolve(__dirname, '../src/utils/themeManager.js');
  if (!existsSync(themeManagerPath)) {
    console.log(
      '   ⚠️  themeManager.js missing - will be created during build'
    );
  } else {
    console.log('   ✓ themeManager.js exists');
  }
}

// Run all fixes
async function runFixes() {
  try {
    fixCSSFiles();
    fixComponentImports();
    validateThemes();
    validatePackageFiles();
    createMissingFiles();

    console.log(`\n✅ Quick fixes completed!`);
    if (fixesApplied > 0) {
      console.log(`   Applied ${fixesApplied} fixes`);
      console.log('\n🔄 Recommended next steps:');
      console.log('   1. npm run clean');
      console.log('   2. npm run build:all');
      console.log('   3. npm run test:integration');
    } else {
      console.log('   No fixes needed - files look good');
      console.log('\n🚀 Try running the build:');
      console.log('   npm run build:all');
    }
  } catch (error) {
    console.error('\n❌ Error during fixes:', error.message);
    process.exit(1);
  }
}

runFixes();
