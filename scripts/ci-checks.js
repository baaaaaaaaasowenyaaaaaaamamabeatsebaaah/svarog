#!/usr/bin/env node

/**
 * CI Check Script
 *
 * This script runs checks before CI/CD pipeline to catch common issues
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Running pre-CI checks...');

// Check for common issues in test files
try {
  console.log('Checking test files for common issues...');

  const testFiles = findFiles(path.resolve(__dirname, '../src'), '.test.js');
  let issues = 0;

  testFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');

    // Check for proper vitest imports
    if (
      !content.includes('import { describe, it, expect') &&
      !content.includes('import { test, expect')
    ) {
      console.error(`❌ ${file}: Missing proper vitest imports`);
      issues++;
    }

    // Check for 'test' usage without import
    if (content.includes('test(') && !content.includes('import { test')) {
      console.error(`❌ ${file}: Using 'test' but not importing it`);
      issues++;
    }

    // Check for vi import but not used
    if (
      content.includes('import { vi }') ||
      content.includes(', vi ') ||
      content.includes(', vi}')
    ) {
      if (!content.includes('vi.')) {
        console.error(`❌ ${file}: 'vi' is imported but not used`);
        issues++;
      }
    }
  });

  if (issues > 0) {
    console.error(
      `Found ${issues} issues in test files. Please fix them before continuing.`
    );
    process.exit(1);
  } else {
    console.log('✅ Test files look good!');
  }
} catch (error) {
  console.error('Error checking test files:', error.message);
  process.exit(1);
}

// Run ESLint to catch any issues
try {
  console.log('Running ESLint...');
  execSync('npx eslint "src/**/*.js" --quiet', { stdio: 'inherit' });
  console.log('✅ ESLint passed!');
} catch (_error) {
  console.error('❌ ESLint failed!');
  process.exit(1);
}

// Run tests to make sure they pass
try {
  console.log('Running tests...');
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ Tests passed!');
} catch (_error) {
  console.error('❌ Tests failed!');
  process.exit(1);
}

console.log('✅ All pre-CI checks passed!');

/**
 * Find files with specific extension in directory and subdirectories
 * @param {string} dir - Directory to search
 * @param {string} ext - File extension to find
 * @returns {string[]} Array of file paths
 */
function findFiles(dir, ext) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  }

  return results;
}
