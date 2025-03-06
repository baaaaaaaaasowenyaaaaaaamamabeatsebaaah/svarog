#!/usr/bin/env node

/**
 * Post-install script to set up husky
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running in CI environment - skip setup if so
if (process.env.CI === 'true') {
  console.log('CI environment detected, skipping husky setup');
  process.exit(0);
}

try {
  // Check if .git directory exists
  const gitDir = path.join(process.cwd(), '.git');
  if (!fs.existsSync(gitDir)) {
    console.log('No .git directory found, skipping husky setup');
    process.exit(0);
  }

  // Install husky hooks
  console.log('Setting up husky hooks...');
  execSync('npx husky install', { stdio: 'inherit' });

  // Make pre-commit hook executable
  const preCommitPath = path.join(process.cwd(), '.husky', 'pre-commit');
  if (fs.existsSync(preCommitPath)) {
    fs.chmodSync(preCommitPath, 0o755);
    console.log('Made pre-commit hook executable');
  }

  console.log('Husky setup completed successfully');
} catch (error) {
  console.error('Error setting up husky:', error.message);
  process.exit(1);
}
