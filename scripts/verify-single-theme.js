import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Verifying theme configuration...\n');

// Check dist-styles.js
const distStylesPath = path.join(__dirname, '../src/styles/dist-styles.js');
if (fs.existsSync(distStylesPath)) {
  const distStylesContent = fs.readFileSync(distStylesPath, 'utf8');
  const distThemeImports =
    distStylesContent.match(/import.*themes.*\.css/g) || [];

  console.log('Themes in dist-styles.js (production):');
  distThemeImports.forEach((imp) => {
    const isDefault = imp.includes('default-theme');
    console.log(isDefault ? `✓ ${imp}` : `✗ ${imp} (should not be here!)`);
  });
} else {
  console.log('✗ dist-styles.js not found! Please create it.');
}

console.log('\n');

// Check regular index.js
const indexPath = path.join(__dirname, '../src/styles/index.js');
const indexContent = fs.readFileSync(indexPath, 'utf8');
const indexThemeImports = indexContent.match(/import.*themes.*\.css/g) || [];

console.log('Themes in index.js (development):');
indexThemeImports.forEach((imp) => {
  console.log(`✓ ${imp} (all themes OK for development)`);
});

// Check if dist-entry.js is using the correct file
console.log('\n');
const distEntryPath = path.join(__dirname, '../dist-entry.js');
const distEntryContent = fs.readFileSync(distEntryPath, 'utf8');

if (distEntryContent.includes('dist-styles.js')) {
  console.log('✓ dist-entry.js correctly imports dist-styles.js');
} else if (distEntryContent.includes('styles/index.js')) {
  console.log(
    '✗ dist-entry.js is importing styles/index.js (should use dist-styles.js)'
  );
} else {
  console.log('⚠️  dist-entry.js does not seem to import any styles');
}

console.log('\n✅ Setup complete! Now build and check the bundle size.');
