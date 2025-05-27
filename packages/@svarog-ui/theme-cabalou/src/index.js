import { injectStyles, css } from 'svarog-ui-core/utils/styleInjection';
import { themeVariables } from './variables.js';
import { componentStyles } from './components.js';

const cabalouTheme = {
  name: 'cabalou',

  apply() {
    this.remove();

    injectStyles(
      'theme-cabalou',
      css`
        :root {
          ${themeVariables}
        }
        .cabalou-theme {
          ${themeVariables}
        }
        ${componentStyles}
      `,
      { priority: 'high' }
    );

    document.documentElement.classList.add('cabalou-theme');
    document.body.classList.add('cabalou-theme');
  },

  remove() {
    document.documentElement.classList.remove('cabalou-theme');
    document.body.classList.remove('cabalou-theme');
  },

  getStyles() {
    return css`
      :root {
        ${themeVariables}
      }
      .cabalou-theme {
        ${themeVariables}
      }
      ${componentStyles}
    `;
  },
};

export default cabalouTheme;
export { cabalouTheme };
