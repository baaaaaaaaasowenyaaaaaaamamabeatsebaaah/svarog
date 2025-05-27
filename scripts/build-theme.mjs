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

  // Extract theme variables (CSS custom properties)
  const variableRegex = /--([\w-]+):\s*([^;]+);/g;
  const variables = [];
  let varMatch;

  // Extract all theme blocks
  const themeBlocks = [];
  const blockRegex = /\.[\w-]+-theme\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g;
  let blockMatch;

  while ((blockMatch = blockRegex.exec(themeCss)) !== null) {
    const content = blockMatch[1];

    // Extract variables from this block
    while ((varMatch = variableRegex.exec(content)) !== null) {
      variables.push(`--${varMatch[1]}: ${varMatch[2]};`);
    }

    // Store the entire block content for component styles
    themeBlocks.push(content.trim());
  }

  // Remove duplicate variables
  const uniqueVariables = [...new Set(variables)];
  const themeVariables = uniqueVariables.join('\n  ');

  // Extract component-specific styles (everything that's not just variables)
  const componentStyleRegex = /\.[\w-]+-theme\s+\.[\w-]+\s*{[^}]+}/g;
  const componentStyles = [];
  let compMatch;

  while ((compMatch = componentStyleRegex.exec(themeCss)) !== null) {
    componentStyles.push(compMatch[0]);
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
${componentStyles.join('\n')}
\`;
`;

  // Create the main theme module
  const themeModule = `// Auto-generated theme module for ${themeName}
import { injectStyles, css } from 'svarog-ui-core/utils/styleInjection';
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

  // Write all the generated files
  const distPath = resolve(
    __dirname,
    `../packages/@svarog-ui/theme-${themeName}/dist`
  );

  writeFileSync(resolve(distPath, 'index.js'), themeModule);
  writeFileSync(resolve(distPath, 'variables.js'), variablesModule);
  writeFileSync(resolve(distPath, 'components.js'), componentsModule);

  // Also create a development version in src
  const srcPath = resolve(
    __dirname,
    `../packages/@svarog-ui/theme-${themeName}/src`
  );

  mkdirSync(srcPath, { recursive: true });

  const devIndex = `// Theme package for ${themeName}
// This file is used during development. The dist files are auto-generated.

import { injectStyles, css } from 'svarog-ui-core/utils/styleInjection';

const ${themeName}Theme = {
  name: '${themeName}',
  
  apply() {
    console.log('Apply ${themeName} theme - development version');
    // In development, you can import the actual CSS or define styles here
  },
  
  remove() {
    console.log('Remove ${themeName} theme - development version');
  },
  
  getStyles() {
    return '';
  }
};

export default ${themeName}Theme;
export { ${themeName}Theme };
`;

  writeFileSync(resolve(srcPath, 'index.js'), devIndex);

  console.log(`✅ Theme "${themeName}" built successfully`);
  console.log(`   Generated files:`);
  console.log(`   - dist/index.js`);
  console.log(`   - dist/variables.js`);
  console.log(`   - dist/components.js`);
} catch (error) {
  console.error(`❌ Failed to build theme "${themeName}":`, error.message);
  process.exit(1);
}
