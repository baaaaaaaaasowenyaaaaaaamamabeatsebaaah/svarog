import { injectStyles, css } from 'svarog-ui-core/utils/styleInjection';
import { themeVariables } from './variables.js';
import { componentStyles } from './components.js';

const muchandyTheme = {
  name: 'muchandy',

  apply() {
    this.remove();

    injectStyles(
      'theme-muchandy',
      css`
        :root {
          ${themeVariables}
        }
        .muchandy-theme {
          ${themeVariables}
        }
        ${componentStyles}
      `,
      { priority: 'high' }
    );

    document.documentElement.classList.add('muchandy-theme');
    document.body.classList.add('muchandy-theme');
  },

  remove() {
    document.documentElement.classList.remove('muchandy-theme');
    document.body.classList.remove('muchandy-theme');
  },

  getStyles() {
    return css`
      :root {
        ${themeVariables}
      }
      .muchandy-theme {
        ${themeVariables}
      }
      ${componentStyles}
    `;
  },
};

export default muchandyTheme;
export { muchandyTheme };
