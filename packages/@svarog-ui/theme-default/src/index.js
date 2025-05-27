// Import style injection utilities from core
import { injectStyles, css } from 'svarog-ui-core/utils/styleInjection';
import { themeVariables } from './variables.js';
import { componentStyles } from './components.js';

const defaultTheme = {
  name: 'default',

  apply() {
    // Remove other themes first
    this.remove();

    // Inject theme styles using the core style injection system
    injectStyles(
      'theme-default',
      css`
        /* Apply theme variables to root for global access */
        :root {
          ${themeVariables}
        }

        /* Theme-specific class for scoping */
        .default-theme {
          ${themeVariables}
        }

        /* Component style overrides */
        ${componentStyles}
      `,
      { priority: 'high' }
    );

    // Add theme classes
    document.documentElement.classList.add('default-theme');
    document.body.classList.add('default-theme');
  },

  remove() {
    // Remove theme classes
    document.documentElement.classList.remove('default-theme');
    document.body.classList.remove('default-theme');
    // Note: We don't remove the style element as it's managed by the injection system
  },

  getStyles() {
    return css`
      :root {
        ${themeVariables}
      }
      .default-theme {
        ${themeVariables}
      }
      ${componentStyles}
    `;
  },

  // Additional utility methods
  getVariables() {
    return themeVariables;
  },

  getComponentStyles() {
    return componentStyles;
  },
};

// Auto-register with ThemeManager if available
if (typeof window !== 'undefined') {
  import('svarog-ui-core/utils/themeManager')
    .then(({ registerTheme }) => {
      registerTheme('default', defaultTheme);
    })
    .catch(() => {
      // ThemeManager not available, that's okay
    });
}

export default defaultTheme;
export { defaultTheme };
