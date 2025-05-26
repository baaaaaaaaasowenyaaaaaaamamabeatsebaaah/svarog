import { injectStyles, css } from 'svarog-ui-core/utils/styleInjection';

/**
 * Default theme structure
 */
const defaultThemeStructure = {
  colors: {
    primary: '#2196f3',
    primaryLight: '#64b5f6',
    primaryDark: '#1976d2',
    secondary: '#ff5722',
    text: '#333333',
    background: '#ffffff',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    sizes: {
      h1: '3rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      small: '0.875rem',
    },
  },
  spacing: {
    unit: '8px',
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  components: {
    button: {
      padding: '6px 16px',
      borderRadius: '4px',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    card: {
      padding: '16px',
      borderRadius: '4px',
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  },
};

/**
 * Create a custom theme
 * @param {string} name - Theme name
 * @param {Object} config - Theme configuration
 * @returns {Object} Theme object
 */
export function createTheme(name, config = {}) {
  // Deep merge with defaults
  const themeConfig = deepMerge(defaultThemeStructure, config);

  // Generate CSS from config
  const themeCSS = generateThemeCSS(name, themeConfig);

  // Create theme object
  const theme = {
    name,

    apply() {
      injectStyles(`theme-${name}`, themeCSS, { priority: 'high' });
      document.documentElement.classList.add(`${name}-theme`);
      document.body.classList.add(`${name}-theme`);
    },

    remove() {
      document.documentElement.classList.remove(`${name}-theme`);
      document.body.classList.remove(`${name}-theme`);
    },

    extend(extensions) {
      const extendedConfig = deepMerge(themeConfig, extensions);
      return createTheme(`${name}-extended`, extendedConfig);
    },

    getConfig() {
      return JSON.parse(JSON.stringify(themeConfig));
    },

    getCSSVariables() {
      return extractCSSVariables(themeConfig);
    },

    exportCSS() {
      return themeCSS;
    },
  };

  return theme;
}

/**
 * Generate CSS from theme configuration
 */
function generateThemeCSS(name, config) {
  const cssVars = extractCSSVariables(config);

  return css`
    .${name}-theme {
      /* Color variables */
      --color-brand-primary: ${config.colors.primary};
      --color-brand-primary-light: ${config.colors.primaryLight};
      --color-brand-primary-dark: ${config.colors.primaryDark};
      --color-brand-secondary: ${config.colors.secondary};
      --color-text: ${config.colors.text};
      --color-bg: ${config.colors.background};

      /* Typography variables */
      --font-family-primary: ${config.typography.fontFamily};
      --typography-h1-size: ${config.typography.sizes.h1};
      --typography-h2-size: ${config.typography.sizes.h2};
      --typography-h3-size: ${config.typography.sizes.h3};
      --typography-body-size: ${config.typography.sizes.body};
      --typography-small-size: ${config.typography.sizes.small};

      /* Spacing variables */
      --space-1: ${config.spacing.small};
      --space-2: ${config.spacing.medium};
      --space-3: ${config.spacing.large};

      /* Component: Button */
      --button-bg: var(--color-brand-primary);
      --button-color: white;
      --button-padding: ${config.components.button.padding};
      --button-radius: ${config.components.button.borderRadius};
      --button-font-size: ${config.components.button.fontSize};
      --button-font-weight: ${config.components.button.fontWeight};

      /* Component: Card */
      --card-padding: ${config.components.card.padding};
      --card-radius: ${config.components.card.borderRadius};
      --card-shadow: ${config.components.card.shadow};

      /* Add all other generated variables */
      ${Object.entries(cssVars)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')}
    }
  `;
}

/**
 * Deep merge utility
 */
function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

/**
 * Extract CSS variables from config object
 */
function extractCSSVariables(config, prefix = '') {
  const variables = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(variables, extractCSSVariables(value, `${prefix}${key}-`));
    } else {
      const varName = `--${prefix}${key}`
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
      variables[varName] = value;
    }
  }

  return variables;
}

/**
 * Helper to create theme from CSS variables
 */
export function createThemeFromVariables(name, variables) {
  const themeCSS = css`
    .${name}-theme {
      ${Object.entries(variables)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')}
    }
  `;

  return {
    name,
    apply() {
      injectStyles(`theme-${name}`, themeCSS, { priority: 'high' });
      document.documentElement.classList.add(`${name}-theme`);
    },
    remove() {
      document.documentElement.classList.remove(`${name}-theme`);
    },
  };
}

// Export theme structure for TypeScript users
export { defaultThemeStructure };
