// scripts/build-theme.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const themeName = process.argv[2];
if (!themeName) {
  console.error(
    '❌ Please provide theme name: node build-theme.mjs <theme-name>'
  );
  process.exit(1);
}

try {
  // Ensure dist directory exists
  mkdirSync(
    resolve(__dirname, `../packages/@svarog-ui/theme-${themeName}/dist`),
    { recursive: true }
  );

  // Read the theme CSS from existing files
  const themeCssPath = resolve(
    __dirname,
    `../src/styles/themes/${themeName}-theme.css`
  );
  const themeCss = readFileSync(themeCssPath, 'utf-8');

  // Extract all theme blocks and combine their content
  const themeBlocks = [];
  const regex = /\.[\w-]+-theme\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g;
  let match;

  while ((match = regex.exec(themeCss)) !== null) {
    // Clean up the content - remove extra whitespace but keep structure
    const content = match[1]
      .trim()
      .split('\n')
      .map((line) => '  ' + line.trim()) // Indent each line
      .join('\n');
    themeBlocks.push(content);
  }

  // Combine all theme blocks with proper formatting
  const combinedCss = themeBlocks.join('\n\n');

  // Create the theme module
  const themeModule = `// Auto-generated theme module for ${themeName}
const themeStyles = \`.${themeName}-theme {
${combinedCss}
}\`;

const ${themeName}Theme = {
  name: '${themeName}',
  
  apply() {
    // Create style element
    let styleEl = document.getElementById('svarog-theme-${themeName}');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'svarog-theme-${themeName}';
      styleEl.setAttribute('data-svarog', 'theme-${themeName}');
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = themeStyles;
    
    // Add theme classes
    document.documentElement.classList.add('${themeName}-theme');
    document.body.classList.add('${themeName}-theme');
  },
  
  remove() {
    // Remove theme classes
    document.documentElement.classList.remove('${themeName}-theme');
    document.body.classList.remove('${themeName}-theme');
    
    // Remove style element
    const styleEl = document.getElementById('svarog-theme-${themeName}');
    if (styleEl) {
      styleEl.remove();
    }
  },
  
  getStyles() {
    return themeStyles;
  }
};

export default ${themeName}Theme;
export { ${themeName}Theme };
`;

  // Write the generated module
  const outputPath = resolve(
    __dirname,
    `../packages/@svarog-ui/theme-${themeName}/dist/index.js`
  );
  writeFileSync(outputPath, themeModule);

  // Also update the source index.js
  const srcIndex = `// Theme package for ${themeName}
// This file is used during development. The dist/index.js is auto-generated.

const ${themeName}Theme = {
  name: '${themeName}',
  apply() {
    console.log('Apply ${themeName} theme - this is the development version');
    // In development, the theme CSS is loaded via imports
  },
  remove() {
    console.log('Remove ${themeName} theme - this is the development version');
  },
  getStyles() {
    // Return empty string in development
    return '';
  }
};

export default ${themeName}Theme;
export { ${themeName}Theme };
`;

  writeFileSync(
    resolve(
      __dirname,
      `../packages/@svarog-ui/theme-${themeName}/src/index.js`
    ),
    srcIndex
  );

  console.log(`✅ Theme "${themeName}" built successfully`);
} catch (error) {
  console.error(`❌ Failed to build theme "${themeName}":`, error.message);
  process.exit(1);
}
