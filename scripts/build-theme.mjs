// scripts/build-theme.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
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
  // Paths
  const packagePath = resolve(
    __dirname,
    `../packages/@svarog-ui/theme-${themeName}`
  );
  const distPath = resolve(packagePath, 'dist');
  const srcPath = resolve(packagePath, 'src');

  // Ensure directories exist
  mkdirSync(distPath, { recursive: true });
  mkdirSync(srcPath, { recursive: true });

  // Read the theme CSS from existing files
  const themeCssPath = resolve(
    __dirname,
    `../src/styles/themes/${themeName}-theme.css`
  );

  if (!existsSync(themeCssPath)) {
    throw new Error(`Theme CSS file not found: ${themeCssPath}`);
  }

  const themeCss = readFileSync(themeCssPath, 'utf-8');

  // Extract theme variables (CSS custom properties)
  const variables = [];

  // Extract all theme blocks
  const themeBlockRegex = /\.[\w-]+-theme\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g;
  let blockMatch;

  while ((blockMatch = themeBlockRegex.exec(themeCss)) !== null) {
    const content = blockMatch[1];

    // Extract variables from this block
    const tempVarRegex = /--([\w-]+):\s*([^;]+);/g;
    let varMatch;
    while ((varMatch = tempVarRegex.exec(content)) !== null) {
      variables.push(`--${varMatch[1]}: ${varMatch[2]};`);
    }
  }

  // Remove duplicate variables
  const uniqueVariables = [...new Set(variables)];
  const themeVariables = uniqueVariables.join('\n    ');

  // Extract component-specific styles (everything that's not just variables)
  const componentStyleRegex = /(\.[a-zA-Z][\w-]*-theme\s+[^{]+{[^}]+})/g;
  const componentStyles = [];
  let compMatch;

  while ((compMatch = componentStyleRegex.exec(themeCss)) !== null) {
    componentStyles.push(compMatch[0].trim());
  }

  // Also extract nested styles
  const nestedStyleRegex = /(\.[a-zA-Z][\w-]*-theme\s*{[^{}]*{[^}]+}[^}]*})/g;
  let nestedMatch;
  while ((nestedMatch = nestedStyleRegex.exec(themeCss)) !== null) {
    if (!nestedMatch[0].includes('--')) {
      // Skip if it's just variables
      componentStyles.push(nestedMatch[0].trim());
    }
  }

  // Create variables.js file
  const variablesModule = `// Auto-generated theme variables for ${themeName}
export const themeVariables = \`
    ${themeVariables}
\`;
`;

  // Create components.js file
  const componentsModule = `// Auto-generated component styles for ${themeName}
export const componentStyles = \`
  ${componentStyles.join('\n  ')}
\`;
`;

  // Create the main theme module (DIST version - this is the real one)
  const distThemeModule = `// Auto-generated theme module for ${themeName}
import { injectStyles, css } from '../../../svarog-ui-core/dist/index.js';
import { themeVariables } from './variables.js';
import { componentStyles } from './components.js';

const ${themeName}Theme = {
  name: '${themeName}',
  
  apply() {
    this.remove();
    
    injectStyles('theme-${themeName}', css\`
      :root {
        \${themeVariables}
      }
      .${themeName}-theme {
        \${themeVariables}
      }
      \${componentStyles}
    \`, { priority: 'high' });
    
    document.documentElement.classList.add('${themeName}-theme');
    document.body.classList.add('${themeName}-theme');
  },
  
  remove() {
    document.documentElement.classList.remove('${themeName}-theme');
    document.body.classList.remove('${themeName}-theme');
  },
  
  getStyles() {
    return css\`
      :root {
        \${themeVariables}
      }
      .${themeName}-theme {
        \${themeVariables}
      }
      \${componentStyles}
    \`;
  }
};

export default ${themeName}Theme;
export { ${themeName}Theme };
`;

  // Create the development version (SRC - just a placeholder)
  const srcThemeModule = `// Development placeholder for ${themeName} theme
// The actual theme is in the dist directory

const ${themeName}Theme = {
  name: '${themeName}',
  apply() {
    console.warn('Using development placeholder for ${themeName} theme. Run build-theme script to generate the actual theme.');
  },
  remove() {
    // Development placeholder
  },
  getStyles() {
    return '';
  }
};

export default ${themeName}Theme;
export { ${themeName}Theme };
`;

  // Write all the generated files to DIST
  writeFileSync(resolve(distPath, 'index.js'), distThemeModule);
  writeFileSync(resolve(distPath, 'variables.js'), variablesModule);
  writeFileSync(resolve(distPath, 'components.js'), componentsModule);

  // Write placeholder to SRC
  writeFileSync(resolve(srcPath, 'index.js'), srcThemeModule);

  console.log(`✅ Theme "${themeName}" built successfully`);
  console.log(`   📁 Production files (dist/):`);
  console.log(`      - dist/index.js (main theme module)`);
  console.log(`      - dist/variables.js (CSS variables)`);
  console.log(`      - dist/components.js (component styles)`);
  console.log(`   📁 Development file (src/):`);
  console.log(`      - src/index.js (placeholder)`);
  console.log(`\n   ℹ️  Use the files in dist/ for production!`);
} catch (error) {
  console.error(`❌ Failed to build theme "${themeName}":`, error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}
