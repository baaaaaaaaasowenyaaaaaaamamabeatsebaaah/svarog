// scripts/build-theme.mjs
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

try {
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
  const themeCssPath = resolve(
    __dirname,
    `../src/styles/themes/${themeName}-theme.css`
  );
  if (!existsSync(themeCssPath)) {
    throw new Error(`Theme CSS file not found: ${themeCssPath}`);
  }

  const themeCss = readFileSync(themeCssPath, 'utf-8');

  // Extract and validate CSS
  const { variables, componentStyles } = extractThemeStyles(
    themeCss,
    themeName
  );

  // Generate self-contained modules (no external dependencies)
  const modules = generateSelfContainedThemeModules(
    themeName,
    variables,
    componentStyles,
    themeCss
  );

  // Write files to dist only
  Object.entries(modules).forEach(([filename, content]) => {
    writeFileSync(resolve(distPath, filename), content);
  });

  // Remove src folder if it exists (build-only approach)
  if (existsSync(srcPath)) {
    rmSync(srcPath, { recursive: true, force: true });
  }

  console.log(`✅ Theme "${themeName}" built successfully`);
  console.log(`   📁 Generated files in dist/:`);
  Object.keys(modules).forEach((file) => {
    console.log(`      - ${file}`);
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

  // More robust CSS variable extraction
  const variableRegexes = [
    // Match .theme-name { --var: value; }
    new RegExp(`\\.${themeName}-theme\\s*{([^}]+)}`, 'gs'),
    // Match :root { --var: value; }
    /:root\s*{([^}]+)}/gs,
  ];

  variableRegexes.forEach((regex) => {
    let match;
    while ((match = regex.exec(css)) !== null) {
      const content = match[1];
      // More robust variable matching that handles complex values
      const varMatches = content.matchAll(/--([\w-]+):\s*([^;]+);/gs);

      for (const [, name, value] of varMatches) {
        // Clean up the value, handling quotes and complex values
        const cleanValue = value
          .trim()
          .replace(/\s+/g, ' ') // Normalize whitespace
          .replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes if present

        variables.set(`--${name}`, cleanValue);
      }
    }
  });

  // Extract component-specific styles (non-variable rules)
  const componentStyleRegexes = [
    // Match .theme-name .component { ... }
    new RegExp(`(\\.${themeName}-theme\\s+[^{,]+{[^}]+})`, 'gs'),
    // Match complex selectors
    new RegExp(`(\\.${themeName}-theme[^{]*{(?:[^{}]*{[^}]*})*[^}]*})`, 'gs'),
  ];

  componentStyleRegexes.forEach((regex) => {
    let match;
    while ((match = regex.exec(css)) !== null) {
      const style = match[1].trim();

      // Only add if it's not just variable declarations
      if (style && !style.match(/^\.[^{]+{\s*--[\w-]+:[^}]+}$/)) {
        // Clean up the style
        const cleanStyle = style
          .replace(/\s+/g, ' ')
          .replace(/\{\s+/g, '{ ')
          .replace(/\s+\}/g, ' }')
          .replace(/;\s+/g, '; ');

        componentStyles.add(cleanStyle);
      }
    }
  });

  return {
    variables: Array.from(variables.entries())
      .map(([name, value]) => `${name}: ${value};`)
      .join('\n    '),
    componentStyles: Array.from(componentStyles).join('\n  '),
  };
}

function generateSelfContainedThemeModules(
  themeName,
  variables,
  componentStyles,
  originalCss
) {
  // Clean and escape CSS for template literal
  const cleanCSS = originalCss
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/`/g, '\\`') // Escape backticks
    .replace(/\$\{/g, '\\${') // Escape template literals
    .trim();

  // Self-contained style injection (no external dependencies)
  const styleInjectionCode = `
/**
 * Self-contained style injection for ${themeName} theme
 * No external dependencies - everything needed is included
 */
const injectStyles = (id, css, options = {}) => {
  const { priority = 'normal' } = options;
  
  // Skip in non-browser environments
  if (typeof document === 'undefined') {
    return;
  }
  
  // Check if style already exists
  const existingStyle = document.getElementById(id);
  if (existingStyle) {
    return;
  }
  
  // Create style element
  const style = document.createElement('style');
  style.id = id;
  style.setAttribute('data-svarog', id);
  style.textContent = css;
  
  // Insert based on priority
  const head = document.head;
  if (priority === 'high') {
    head.insertBefore(style, head.firstChild);
  } else {
    head.appendChild(style);
  }
};

const css = (strings, ...values) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');
};
`;

  return {
    'index.js': `/**
 * ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme for Svarog UI
 * Auto-generated self-contained theme module
 * 
 * @module @svarog-ui/theme-${themeName}
 * @version 1.0.0
 */

${styleInjectionCode}

/**
 * ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme object
 * @typedef {Object} Theme
 * @property {string} name - Theme name
 * @property {Function} apply - Apply the theme to the document
 * @property {Function} remove - Remove the theme from the document
 * @property {Function} removeAllThemeClasses - Remove all theme classes
 * @property {Function} getStyles - Get the theme CSS as a string
 * @property {Function} getVariables - Get theme variables as an object
 */
const ${themeName}Theme = {
  name: '${themeName}',
  
  /**
   * Apply the ${themeName} theme to the document
   * This will remove any existing theme and apply this one
   */
  apply() {
    // Remove any existing theme classes first
    this.removeAllThemeClasses();
    
    const styles = \`${cleanCSS}\`;
    
    injectStyles('theme-${themeName}', styles, { priority: 'high' });
    
    document.documentElement.classList.add('${themeName}-theme');
    document.body.classList.add('${themeName}-theme');
    
    // Dispatch theme change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themeapplied', { 
        detail: { theme: '${themeName}' } 
      }));
    }
  },
  
  /**
   * Remove the ${themeName} theme from the document
   */
  remove() {
    document.documentElement.classList.remove('${themeName}-theme');
    document.body.classList.remove('${themeName}-theme');
    
    // Remove style element
    const styleEl = document.getElementById('theme-${themeName}');
    if (styleEl) {
      styleEl.remove();
    }
  },
  
  /**
   * Remove all theme classes from the document
   * Useful when switching between themes
   */
  removeAllThemeClasses() {
    // Remove all theme classes from common theme names
    const commonThemes = ['default', 'cabalou', 'muchandy', 'dark', 'light'];
    commonThemes.forEach(theme => {
      document.documentElement.classList.remove(\`\${theme}-theme\`);
      document.body.classList.remove(\`\${theme}-theme\`);
      
      // Remove their style elements
      const styleEl = document.getElementById(\`theme-\${theme}\`);
      if (styleEl) {
        styleEl.remove();
      }
    });
  },
  
  /**
   * Get the complete theme CSS as a string
   * @returns {string} Theme CSS
   */
  getStyles() {
    return \`${cleanCSS}\`;
  },
  
  /**
   * Get theme variables as a JavaScript object
   * @returns {Object} Object with CSS variable names as keys
   */
  getVariables() {
    return {
      ${Array.from(extractVariablesObject(variables))
        .map(
          ([key, value]) => `'${key}': '${value.replace(/'/g, "\\'")}'` // Escape single quotes
        )
        .join(',\n      ')}
    };
  }
};

export default ${themeName}Theme;
export { ${themeName}Theme };
`,

    'variables.js': `/**
 * ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme variables
 * @module @svarog-ui/theme-${themeName}/variables
 */

/**
 * Theme variables as CSS string
 * @type {string}
 */
export const themeVariables = \`${variables.replace(/`/g, '\\`')}\`;

/**
 * Theme variables as JavaScript object
 * @type {Object<string, string>}
 */
export const variablesObject = {
  ${Array.from(extractVariablesObject(variables))
    .map(([key, value]) => `'${key}': '${value.replace(/'/g, "\\'")}'`)
    .join(',\n  ')}
};

export default variablesObject;
`,

    'components.js': `/**
 * ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme component styles
 * @module @svarog-ui/theme-${themeName}/components
 */

/**
 * Component-specific styles for the ${themeName} theme
 * @type {string}
 */
export const componentStyles = \`${componentStyles.replace(/`/g, '\\`')}\`;

export default componentStyles;
`,

    'raw.css': originalCss, // Include raw CSS for advanced users
  };
}

function extractVariablesObject(variablesString) {
  const variables = new Map();
  const lines = variablesString.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') && trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed
        .substring(colonIndex + 1)
        .replace(';', '')
        .trim();
      variables.set(key, value);
    }
  });

  return variables;
}
