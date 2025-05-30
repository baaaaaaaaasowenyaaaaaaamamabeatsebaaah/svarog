import { rmSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');

function cleanupMarkdownFiles() {
  console.log('🧹 Cleaning up markdown files from theme packages...\n');

  const themePackages = [
    'packages/@svarog-ui/theme-default',
    'packages/@svarog-ui/theme-cabalou',
    'packages/@svarog-ui/theme-muchandy',
    'packages/@svarog-ui/create-theme',
  ];

  let totalFilesRemoved = 0;

  themePackages.forEach((packagePath) => {
    const fullPackagePath = resolve(rootDir, packagePath);
    const packageName = packagePath.split('/').pop();

    if (!existsSync(fullPackagePath)) {
      console.log(`⚠️  Package not found: ${packageName}`);
      return;
    }

    console.log(`📦 Processing ${packageName}:`);

    // Files to remove
    const filesToRemove = ['CHANGELOG.md', 'LICENSE.md'];

    filesToRemove.forEach((filename) => {
      const filePath = resolve(fullPackagePath, filename);

      if (existsSync(filePath)) {
        try {
          rmSync(filePath, { force: true });
          console.log(`  ✓ Removed: ${filename}`);
          totalFilesRemoved++;
        } catch (error) {
          console.error(`  ❌ Failed to remove ${filename}:`, error.message);
        }
      } else {
        console.log(`  - ${filename} (not found)`);
      }
    });

    console.log(''); // Empty line for readability
  });

  console.log(`✅ Cleanup completed! Removed ${totalFilesRemoved} files.`);

  if (totalFilesRemoved > 0) {
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm run build:themes');
    console.log('2. Test webpack build: npm run dev');
  }
}

// Run cleanup
cleanupMarkdownFiles();
