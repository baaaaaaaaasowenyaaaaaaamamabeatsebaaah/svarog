#!/bin/bash
# scripts/migrate-themes.sh

echo "🔄 Migrating theme packages..."

# Function to update package.json
update_package_json() {
  local theme=$1
  local package_file="packages/@svarog-ui/theme-$theme/package.json"

  echo "📝 Updating $package_file..."

  # Create a Node.js script to update the package.json
  node -e "
    const fs = require('fs');
    const path = require('path');

    const pkgPath = '$package_file';
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    // Update main fields
    pkg.main = 'dist/index.js';
    pkg.module = 'dist/index.js';

    // Clean up exports
    pkg.exports = {
      '.': './dist/index.js',
      './variables': './dist/variables.js',
      './components': './dist/components.js'
    };

    // Ensure files array is correct
    pkg.files = ['dist', 'README.md'];

    // Add or update scripts
    if (!pkg.scripts) pkg.scripts = {};
    pkg.scripts.build = 'node ../../../scripts/build-theme.mjs $theme';
    pkg.scripts.prepublishOnly = 'npm run build';

    // Write back
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\\n');

    console.log('✅ Updated ' + pkgPath);
  "
}

# Process each theme
for theme in default cabalou muchandy; do
  echo ""
  echo "📦 Processing theme-$theme..."

  # Remove src folder if it exists
  if [ -d "packages/@svarog-ui/theme-$theme/src" ]; then
    echo "🗑️  Removing src folder..."
    rm -rf "packages/@svarog-ui/theme-$theme/src"
  fi

  # Update package.json
  update_package_json $theme

  # Build the theme
  echo "🔨 Building theme-$theme..."
  node scripts/build-theme.mjs $theme

  echo "✅ theme-$theme migrated successfully!"
done

echo ""
echo "✨ All themes migrated successfully!"
echo ""
echo "Next steps:"
echo "1. Test the themes: npm run test:integration"
echo "2. Commit changes: git add -A && git commit -m 'refactor: migrate theme system to build-only approach'"
echo "3. Publish themes: lerna publish --scope='@svarog-ui/theme-*'"
