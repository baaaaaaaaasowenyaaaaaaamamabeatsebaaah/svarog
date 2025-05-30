// File: scripts/build-theme.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
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

// VALIDATION: Check if source CSS exists
const validateSourceFiles = () => {
  const themeCssPath = resolve(
    __dirname,
    `../src/styles/themes/${themeName}-theme.css`
  );

  if (!existsSync(themeCssPath)) {
    console.error(`❌ Theme CSS file not found: ${themeCssPath}`);
    console.error(`   Expected: src/styles/themes/${themeName}-theme.css`);
    process.exit(1);
  }

  console.log(`✅ Source CSS found: ${themeCssPath}`);
  return themeCssPath;
};

try {
  console.log(`🔨 Building theme: ${themeName}`);

  // Validate source files first
  const themeCssPath = validateSourceFiles();

  // Paths
  const packagePath = resolve(
    __dirname,
    `../packages/@svarog-ui/theme-${themeName}`
  );
  const distPath = resolve(packagePath, 'dist');
  const srcPath = resolve(packagePath, 'src');

  // Clean dist directory
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true });
  }
  mkdirSync(distPath, { recursive: true });

  // Read theme CSS
  const themeCss = readFileSync(themeCssPath, 'utf-8');

  // Extract and validate CSS
  const { variables, componentStyles } = extractThemeStyles(
    themeCss,
    themeName
  );

  // VALIDATION: Check if we extracted anything
  if (!variables && !componentStyles) {
    console.warn(
      `⚠️  Warning: No theme variables or styles extracted from ${themeName}-theme.css`
    );
  }

  // Generate modules
  const modules = generateThemeModules(themeName, variables, componentStyles);

  // Write files to dist only
  Object.entries(modules).forEach(([filename, content]) => {
    writeFileSync(resolve(distPath, filename), content);
  });

  // Remove src folder if it exists
  if (existsSync(srcPath)) {
    rmSync(srcPath, { recursive: true, force: true });
  }

  console.log(`✅ Theme "${themeName}" built successfully`);
  console.log(`   📁 Generated files in dist/:`);
  Object.keys(modules).forEach((file) => {
    console.log(`      - ${file}`);
  });

  // VALIDATION: Verify generated files exist
  Object.keys(modules).forEach((filename) => {
    const filePath = resolve(distPath, filename);
    if (!existsSync(filePath)) {
      throw new Error(`Failed to generate ${filename}`);
    }
  });
} catch (error) {
  console.error(`❌ Failed to build theme "${themeName}":`, error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}

function extractThemeStyles(css, themeName) {
  const variables = new Map();
  const componentStyles = new Set();

  // Extract variables with better regex
  const varRegex = new RegExp(`\\.${themeName}-theme\\s*{([^}]+)}`, 'g');
  let match;

  while ((match = varRegex.exec(css)) !== null) {
    const content = match[1];
    const varMatches = content.matchAll(/--([\w-]+):\s*([^;]+);/g);

    for (const [, name, value] of varMatches) {
      variables.set(`--${name}`, value.trim());
    }
  }

  // Also extract :root variables if they exist
  const rootRegex = /:root\s*{([^}]+)}/g;
  while ((match = rootRegex.exec(css)) !== null) {
    const content = match[1];
    const varMatches = content.matchAll(/--([\w-]+):\s*([^;]+);/g);

    for (const [, name, value] of varMatches) {
      variables.set(`--${name}`, value.trim());
    }
  }

  // Extract component-specific styles
  const componentRegex = new RegExp(
    `(\\.${themeName}-theme\\s+[^{]+{[^}]+})`,
    'g'
  );

  while ((match = componentRegex.exec(css)) !== null) {
    const style = match[1].trim();
    // Only add if it's not just variable declarations
    if (!style.match(/^\.[^{]+{\s*--[\w-]+:[^}]+}$/)) {
      componentStyles.add(style);
    }
  }

  // Extract nested styles (e.g., .theme-name .component)
  const nestedRegex = new RegExp(
    `(\\.${themeName}-theme\\s+\\.[\\w-]+\\s*{[^}]+})`,
    'g'
  );

  while ((match = nestedRegex.exec(css)) !== null) {
    componentStyles.add(match[1].trim());
  }

  return {
    variables: Array.from(variables.entries())
      .map(([name, value]) => `${name}: ${value};`)
      .join('\n    '),
    componentStyles: Array.from(componentStyles).join('\n  '),
  };
}

function generateThemeModules(themeName, variables, componentStyles) {
  return {
    'index.js': `// Auto-generated theme module for ${themeName}
// This file is designed to work with the modular Svarog UI system

const ${themeName}Theme = {
  name: '${themeName}',

  apply() {
    this.remove();

    // For production use, we inject styles directly without imports
    const style = document.createElement('style');
    style.setAttribute('data-svarog', 'theme-${themeName}');
    style.setAttribute('data-priority', 'theme');
    style.setAttribute('data-priority-value', '300');
    style.textContent = \`
      :root {
        ${variables}
      }
      .${themeName}-theme {
        ${variables}
      }
      ${componentStyles}
    \`;
    document.head.appendChild(style);

    document.documentElement.classList.add('${themeName}-theme');
    document.body.classList.add('${themeName}-theme');
  },

  remove() {
    // Remove style tag
    const styleTag = document.querySelector('[data-svarog="theme-${themeName}"]');
    if (styleTag) {
      styleTag.remove();
    }

    // Remove classes
    document.documentElement.classList.remove('${themeName}-theme');
    document.body.classList.remove('${themeName}-theme');
  },

  getStyles() {
    return \`
      :root {
        ${variables}
      }
      .${themeName}-theme {
        ${variables}
      }
      ${componentStyles}
    \`;
  }
};

export default ${themeName}Theme;
export { ${themeName}Theme };
`,

    'variables.js': `// Auto-generated theme variables for ${themeName}
export const themeVariables = \`
    ${variables}
\`;
`,

    'components.js': `// Auto-generated component styles for ${themeName}
export const componentStyles = \`
  ${componentStyles}
\`;
`,
  };
}
