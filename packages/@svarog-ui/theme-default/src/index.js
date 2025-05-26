import { injectStyles, css } from 'svarog-ui-core/utils/styleInjection';
import { themeVariables } from './variables.js';
import { componentStyles } from './components.js';

// Combine all theme styles
const defaultThemeStyles = css`
  /* Base theme variables */
  .default-theme {
    ${themeVariables}
  }

  /* Component-specific overrides */
  .default-theme {
    ${componentStyles}
  }
`;

// Theme object that follows the theme interface
const defaultTheme = {
  name: 'default',

  /**
   * Apply the theme
   */
  apply() {
    // Inject theme styles
    injectStyles('theme-default', defaultThemeStyles, { priority: 'high' });

    // Add theme class
    document.documentElement.classList.add('default-theme');
    document.body.classList.add('default-theme');
  },

  /**
   * Remove the theme
   */
  remove() {
    document.documentElement.classList.remove('default-theme');
    document.body.classList.remove('default-theme');
  },

  /**
   * Get theme variables as an object
   */
  getVariables() {
    return parseVariables(themeVariables);
  },

  /**
   * Extend theme with custom variables
   */
  extend(customVariables) {
    const extendedStyles = css`
      .default-theme {
        ${themeVariables}
        ${generateVariables(customVariables)}
      }

      .default-theme {
        ${componentStyles}
      }
    `;

    return {
      name: 'default-extended',
      apply() {
        injectStyles('theme-default-extended', extendedStyles, {
          priority: 'high',
        });
        document.documentElement.classList.add('default-theme');
      },
      remove() {
        document.documentElement.classList.remove('default-theme');
      },
    };
  },
};

// Helper to parse CSS variables into an object
function parseVariables(cssString) {
  const variables = {};
  const regex = /--([\w-]+):\s*([^;]+);/g;
  let match;

  while ((match = regex.exec(cssString)) !== null) {
    variables[match[1]] = match[2].trim();
  }

  return variables;
}

// Helper to generate CSS variables from an object
function generateVariables(variables) {
  return Object.entries(variables)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n');
}

export default defaultTheme;
export { defaultTheme };
