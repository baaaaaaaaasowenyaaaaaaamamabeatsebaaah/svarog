#!/usr/bin/env node
/**
 * Debug script to check what's in the core package before building
 */

import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');
const corePackageDir = resolve(rootDir, 'packages/svarog-ui-core');

console.log('🔍 Debugging svarog-ui-core package structure...\n');

// Check if core package exists
if (!existsSync(corePackageDir)) {
  console.error('❌ Core package directory not found');
  process.exit(1);
}

// Check src directory
const srcDir = resolve(corePackageDir, 'src');
if (!existsSync(srcDir)) {
  console.log('⚠️  src/ directory not found - run prepare script first');
  process.exit(1);
}

// Check utils directory
const utilsDir = resolve(srcDir, 'utils');
if (existsSync(utilsDir)) {
  console.log('📂 Utils directory contents:');
  const utilFiles = readdirSync(utilsDir).filter((f) => f.endsWith('.js'));
  utilFiles.forEach((file) => {
    const filePath = resolve(utilsDir, file);
    const size = (statSync(filePath).size / 1024).toFixed(1);
    const isProblematic = ['getComponents', 'getPrototypes'].some((name) =>
      file.includes(name)
    );
    console.log(
      `   ${isProblematic ? '⚠️ ' : '✅'} ${file} (${size}KB)${isProblematic ? ' - DEVELOPMENT UTILITY' : ''}`
    );
  });

  // Check for problematic files
  const problemFiles = utilFiles.filter((file) =>
    ['getComponents', 'getPrototypes'].some((name) => file.includes(name))
  );

  if (problemFiles.length > 0) {
    console.log(
      '\n🚨 Found development utilities that will cause build errors:'
    );
    problemFiles.forEach((file) => {
      console.log(`   - ${file} (contains .stories.js imports)`);
    });
    console.log(
      '\n💡 Solution: These files should be excluded from the core package.'
    );
    console.log('   Run the fixed prepare script to exclude them.');
  }
} else {
  console.log('❌ utils/ directory not found');
}

// Check components directory
const componentsDir = resolve(srcDir, 'components');
if (existsSync(componentsDir)) {
  const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  console.log(
    `\n📂 Components directory: ${componentDirs.length} components found`
  );

  // Check for any .stories.js files that shouldn't be there
  const storiesFound = [];
  componentDirs.forEach((componentName) => {
    const componentDir = resolve(componentsDir, componentName);
    const files = readdirSync(componentDir);
    const storyFiles = files.filter((f) => f.includes('.stories.'));
    if (storyFiles.length > 0) {
      storiesFound.push({ component: componentName, stories: storyFiles });
    }
  });

  if (storiesFound.length > 0) {
    console.log('\n🚨 Found .stories.js files that will cause build errors:');
    storiesFound.forEach(({ component, stories }) => {
      console.log(`   ${component}: ${stories.join(', ')}`);
    });
    console.log('\n💡 These should be excluded by the prepare script.');
  } else {
    console.log('   ✅ No .stories.js files found (good!)');
  }
} else {
  console.log('❌ components/ directory not found');
}

// Check index.js
const indexPath = resolve(srcDir, 'index.js');
if (existsSync(indexPath)) {
  const indexContent = readFileSync(indexPath, 'utf-8');

  console.log('\n📄 Index.js analysis:');
  console.log(`   Size: ${(statSync(indexPath).size / 1024).toFixed(1)}KB`);

  // Check for problematic exports
  const hasGetComponents = indexContent.includes('getComponents');
  const hasGetPrototypes = indexContent.includes('getPrototypes');

  if (hasGetComponents || hasGetPrototypes) {
    console.log('   🚨 Contains exports that will cause build errors:');
    if (hasGetComponents) console.log('     - getComponents export found');
    if (hasGetPrototypes) console.log('     - getPrototypes export found');
    console.log(
      '   💡 Update index.js to remove these development utility exports'
    );
  } else {
    console.log('   ✅ No problematic exports found');
  }
} else {
  console.log('❌ index.js not found');
}

console.log('\n📋 Recommendations:');
console.log(
  '1. If development utilities are present, run the fixed prepare script'
);
console.log("2. Ensure index.js doesn't export getComponents/getPrototypes");
console.log('3. Then run: npm run build:core');
