import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update themeNames.json to only include default
const singleTheme = ['default'];
fs.writeFileSync(
  path.join(__dirname, '../themeNames.json'),
  JSON.stringify(singleTheme, null, 2)
);

console.log('✓ Updated themeNames.json to include only default theme');

// Verify dist-entry.js only imports default theme
const distEntryPath = path.join(__dirname, '../dist-entry.js');
const distEntryContent = fs.readFileSync(distEntryPath, 'utf8');

const themeImports = distEntryContent.match(/import.*themes.*\.css/g) || [];
console.log('\nTheme imports found:');
themeImports.forEach((imp) => {
  const isDefault = imp.includes('default-theme');
  console.log(isDefault ? '✓' : '✗', imp);
});

if (themeImports.length > 1) {
  console.warn('\n⚠️  Warning: Multiple theme imports detected!');
  console.log('Only default-theme.css should be imported.');
}
