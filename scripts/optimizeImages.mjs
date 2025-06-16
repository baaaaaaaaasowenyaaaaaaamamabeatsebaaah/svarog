// scripts/optimizeImages.mjs
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];
const MAX_SIZE_MB = 0.5; // 500KB threshold
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * Simple image size checker - following Svarog KISS principle
 * Instead of complex optimization, we identify problematic files
 */
const checkImageSizes = async (dir) => {
  const issues = [];

  const scanDirectory = async (currentDir) => {
    try {
      const items = await readdir(currentDir);

      for (const item of items) {
        // Skip node_modules and other build directories
        if (item === 'node_modules' || item === 'dist' || item === '.git') {
          continue;
        }

        const fullPath = join(currentDir, item);
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (IMAGE_EXTENSIONS.includes(extname(item).toLowerCase())) {
          if (stats.size > MAX_SIZE_BYTES) {
            issues.push({
              path: fullPath,
              size: stats.size,
              sizeMB: (stats.size / 1024 / 1024).toFixed(2),
            });
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
      console.debug(`Skipping ${currentDir}: ${error.message}`);
    }
  };

  await scanDirectory(dir);
  return issues;
};

/**
 * Main function - Algorithmic Elegance in action
 */
const main = async () => {
  console.log('🔍 Scanning for large images...');

  const projectRoot = join(__dirname, '..');
  const issues = await checkImageSizes(projectRoot);

  if (issues.length === 0) {
    console.log('✅ All images are under 500KB');
    return;
  }

  console.log(`\n⚠️  Found ${issues.length} large image(s):`);
  issues.forEach(({ path, sizeMB }) => {
    console.log(`   ${path.replace(projectRoot, '.')} (${sizeMB}MB)`);
  });

  console.log('\n💡 Recommendations:');
  console.log('   1. Compress images using online tools like TinyPNG');
  console.log('   2. Convert PNG to JPG for photos');
  console.log('   3. Use SVG for logos and icons');
  console.log('   4. Consider WebP format for modern browsers');

  console.log('\n🔧 Alternative: Use webpack asset/resource with size limits');
  console.log('   This is already configured in your webpack.config.js');
};

main().catch(console.error);
