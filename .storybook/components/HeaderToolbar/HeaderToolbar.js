import './HeaderToolbar.css';
import { THEMES } from '../../../src/constants/themes.js';
// Import SVG directly - webpack 5 will handle this with Asset Modules
import logo from '../../assets/svg/svarog.svg';

export default class HeaderToolbar {
  constructor({ onSelectTheme }) {
    this.onSelectTheme = (theme) => {
      console.log('Theme selection changed:', theme);
      onSelectTheme(theme);
    };

    this.header = document.createElement('header');
    this.header.className = 'header-toolbar';

    this.logo = document.createElement('img');
    this.logo.src = logo;
    this.logo.alt = 'svarog logo';
    this.logo.className = 'header-logo';

    this.title = document.createElement('h1');
    this.title.textContent = 'Svarog';

    this.themeSelector = document.createElement('select');
    this.themeSelector.className = 'theme-selector';

    Object.keys(THEMES).forEach((theme) => {
      const option = document.createElement('option');
      option.value = THEMES[theme];
      option.textContent = theme;
      this.themeSelector.appendChild(option);
    });

    this.themeSelector.addEventListener('change', () => {
      this.onSelectTheme(this.themeSelector.value);
    });

    this.header.appendChild(this.logo);
    this.header.appendChild(this.title);
    this.header.appendChild(this.themeSelector);
  }

  getElement() {
    return this.header;
  }
}
