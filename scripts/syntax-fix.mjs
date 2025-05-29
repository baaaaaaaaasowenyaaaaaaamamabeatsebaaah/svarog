#!/usr/bin/env node

/**
 * JavaScript Syntax Fix Script
 * Fixes the specific syntax errors found in the build output
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Fixing JavaScript syntax errors...\n');

let fixesApplied = 0;

/**
 * Fix a specific file with syntax issues
 */
function fixFile(filePath, fixes) {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = readFileSync(filePath, 'utf-8');
  let wasModified = false;

  fixes.forEach(({ description, search, replace }) => {
    if (typeof search === 'string') {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        console.log(`   ✓ ${description}`);
        wasModified = true;
        fixesApplied++;
      }
    } else if (search instanceof RegExp) {
      if (search.test(content)) {
        content = content.replace(search, replace);
        console.log(`   ✓ ${description}`);
        wasModified = true;
        fixesApplied++;
      }
    }
  });

  if (wasModified) {
    writeFileSync(filePath, content);
    return true;
  }

  return false;
}

// Fix 1: performance.js - Broken template literal
console.log('🔧 Fixing src/utils/performance.js...');
fixFile(resolve(__dirname, '../src/utils/performance.js'), [
  {
    description: 'Fixed broken template literal in performance measurement',
    search: /\.toFixed\(2\)\}ms`\);/g,
    replace: '.toFixed(2)}ms`);',
  },
  {
    description: 'Fixed string concatenation issue',
    search: /`\$\{[\s\S]*?\.toFixed\(2\)\}ms`/g,
    replace: (match) => {
      // Fix any broken template literal syntax
      return match.replace(/\}\}ms`/g, '}ms`').replace(/\$\$\{/g, '${');
    },
  },
]);

// Fix 2: MuchandyHero.js - Unexpected parenthesis
console.log('🔧 Fixing src/components/MuchandyHero/MuchandyHero.js...');
fixFile(resolve(__dirname, '../src/components/MuchandyHero/MuchandyHero.js'), [
  {
    description: 'Fixed mismatched parentheses',
    search: /\)\s*;\s*\)\s*;/g,
    replace: ');',
  },
  {
    description: 'Fixed extra closing parenthesis',
    search: /\s+\)\s*;\s*$/gm,
    replace: ';',
  },
]);

// Fix 3: Accordion.js - Unterminated string literal
console.log('🔧 Fixing src/components/Accordion/Accordion.js...');
fixFile(resolve(__dirname, '../src/components/Accordion/Accordion.js'), [
  {
    description: 'Fixed unterminated string literal',
    search: /export default AccordionComponent;$/,
    replace: 'export default AccordionComponent;',
  },
  {
    description: 'Fixed any unterminated template literals',
    search: /`[^`]*$/gm,
    replace: (match) => {
      // If we find an unterminated template literal, close it
      if (!match.endsWith('`')) {
        return match + '`;';
      }
      return match;
    },
  },
]);

// Fix 4: Tabs.js - Template literal with "not"
console.log('🔧 Fixing src/components/Tabs/Tabs.js...');
fixFile(resolve(__dirname, '../src/components/Tabs/Tabs.js'), [
  {
    description: 'Fixed broken template literal with "not"',
    search: /did not return an HTMLElement for tab "\$\{tab\.id\}"/g,
    replace: 'did not return an HTMLElement for tab "${tab.id}"',
  },
  {
    description: 'Fixed template literal syntax',
    search: /`[\s\S]*?did not return[\s\S]*?`/g,
    replace: (match) => {
      // Ensure proper template literal syntax
      return match.replace(/"\$\{/g, '${').replace(/\}"/g, '}');
    },
  },
]);

// Fix 5: Map.js - Template literal syntax issue
console.log('🔧 Fixing src/components/Map/Map.js...');
fixFile(resolve(__dirname, '../src/components/Map/Map.js'), [
  {
    description: 'Fixed template literal in HTML generation',
    search: /<h3>\$\{config\.locationName\}<\/h3>/g,
    replace: '<h3>${config.locationName}</h3>',
  },
  {
    description: 'Fixed HTML template literal syntax',
    search: /`[\s\S]*?<h3>\$\{[\s\S]*?<\/h3>[\s\S]*?`/g,
    replace: (match) => {
      // Ensure template literals are properly formatted
      return match
        .replace(/\$\$\{/g, '${')
        .replace(/\}\}/g, '}')
        .replace(/`\s*\+\s*`/g, '');
    },
  },
]);

// General fixes for common template literal issues
console.log('🔧 Applying general template literal fixes...');

const componentFiles = [
  'src/components/Accordion/Accordion.js',
  'src/components/MuchandyHero/MuchandyHero.js',
  'src/components/Tabs/Tabs.js',
  'src/components/Map/Map.js',
  'src/utils/performance.js',
];

componentFiles.forEach((filePath) => {
  const fullPath = resolve(__dirname, '..', filePath);
  if (existsSync(fullPath)) {
    fixFile(fullPath, [
      {
        description: `General template literal fixes for ${filePath}`,
        search: /`([^`]*)\$\$\{([^}]+)\}([^`]*)`/g,
        replace: '`$1${$2}$3`',
      },
      {
        description: `Fix double dollar signs in ${filePath}`,
        search: /\$\$\{/g,
        replace: '${',
      },
      {
        description: `Fix empty template literals in ${filePath}`,
        search: /`\s*`/g,
        replace: "''",
      },
    ]);
  }
});

// Summary
console.log(`\n✅ JavaScript syntax fixes completed!`);
if (fixesApplied > 0) {
  console.log(`   Applied ${fixesApplied} fixes`);
  console.log('\n🔄 Next steps:');
  console.log('   1. npm run clean');
  console.log('   2. npm run build:core');
} else {
  console.log('   No syntax errors found to fix');
  console.log('\n🔍 You may need to manually check these files:');
  console.log('   - src/utils/performance.js (line 88)');
  console.log('   - src/components/MuchandyHero/MuchandyHero.js (line 245)');
  console.log('   - src/components/Accordion/Accordion.js (line 270)');
  console.log('   - src/components/Tabs/Tabs.js (line 84)');
  console.log('   - src/components/Map/Map.js (line 154)');
}
