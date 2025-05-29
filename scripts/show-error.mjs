#!/usr/bin/env node

/**
 * Diagnostic Script - Shows exact content of problematic lines
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Diagnosing exact syntax errors...\n');

// The 5 files with errors from the build output
const problemFiles = [
  {
    path: 'src/utils/performance.js',
    line: 88,
    error: 'Unexpected "."',
  },
  {
    path: 'src/components/MuchandyHero/MuchandyHero.js',
    line: 245,
    error: 'Unexpected ")"',
  },
  {
    path: 'src/components/Accordion/Accordion.js',
    line: 270,
    error: 'Unterminated string literal',
  },
  {
    path: 'src/components/Map/Map.js',
    line: 154,
    error: 'Expected "}" but found "{"',
  },
  {
    path: 'src/components/Tabs/Tabs.js',
    line: 84,
    error: 'Expected ";" but found "not"',
  },
];

function showProblemLine(filePath, lineNumber, error) {
  const fullPath = resolve(__dirname, '..', filePath);

  if (!existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  const content = readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');

  console.log(`\n📄 ${filePath} (Line ${lineNumber})`);
  console.log(`   Error: ${error}`);
  console.log(`   ─────────────────────────────────────────`);

  // Show lines around the problem
  const startLine = Math.max(0, lineNumber - 3);
  const endLine = Math.min(lines.length - 1, lineNumber + 2);

  for (let i = startLine; i <= endLine; i++) {
    const currentLine = i + 1;
    const lineContent = lines[i];
    const marker = currentLine === lineNumber ? '➤' : ' ';
    const lineNum = currentLine.toString().padStart(3, ' ');

    console.log(`${marker} ${lineNum} │ ${lineContent}`);

    if (currentLine === lineNumber) {
      // Show character-by-character analysis
      console.log(`     │ Length: ${lineContent.length} chars`);

      // Show invisible characters
      const visibleChars = lineContent
        .replace(/\t/g, '→')
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/\u00A0/g, '⎵'); // non-breaking space

      if (visibleChars !== lineContent) {
        console.log(`     │ Visible: ${visibleChars}`);
      }

      // Show character codes for weird characters
      const weirdChars = [];
      for (let j = 0; j < lineContent.length; j++) {
        const char = lineContent[j];
        const code = char.charCodeAt(0);
        if (code > 127 || code < 32) {
          weirdChars.push(`pos ${j}: '${char}' (${code})`);
        }
      }

      if (weirdChars.length > 0) {
        console.log(`     │ Special chars: ${weirdChars.join(', ')}`);
      }
    }
  }
}

// Analyze each problem file
problemFiles.forEach(({ path, line, error }) => {
  showProblemLine(path, line, error);
});

console.log('\n\n🔧 Quick Fix Commands:');
console.log('After identifying the issues above, you can fix them with:');
console.log('');
console.log('# Option 1: Manual fixes in your editor');
console.log('# Open each file and fix the specific line');
console.log('');
console.log('# Option 2: Automated fixes');
problemFiles.forEach(({ path, line }) => {
  console.log(`code "${path}:${line}"`);
});
