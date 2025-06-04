// scripts/verify-build.mjs
import { existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const requiredFiles = [
  // Core package
  'packages/svarog-ui-core/src/index.js',
  'packages/svarog-ui-core/src/components/Button/index.js',
  'packages/svarog-ui-core/src/utils/themeManager.js',
  'packages/svarog-ui-core/src/styles/baseVariables.js',
  'packages/svarog-ui-core/src/styles/baseStyles.js',

  // Main package
  'packages/svarog-ui/src/index.js',

  // Theme packages
  'packages/@svarog-ui/theme-default/dist/index.js',
  'packages/@svarog-ui/theme-cabalou/dist/index.js',
  'packages/@svarog-ui/theme-muchandy/dist/index.js',
];

console.log('🔍 Verifying build output...\n');

let allGood = true;

requiredFiles.forEach((file) => {
  const filePath = resolve(rootDir, file);
  const exists = existsSync(filePath);

  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NOT FOUND`);
    allGood = false;
  }
});

if (allGood) {
  console.log('\n✅ All required files are present!');
} else {
  console.log('\n❌ Some required files are missing!');
  process.exit(1);
}

// Check component count
const componentsDir = resolve(
  rootDir,
  'packages/svarog-ui-core/src/components'
);
if (existsSync(componentsDir)) {
  const componentCount = readdirSync(componentsDir).length;
  console.log(`\n📊 Found ${componentCount} components in core package`);
}
