// .storybook/components/HeaderToolbar/HeaderToolbar.js
import './HeaderToolbar.css';
import { THEMES } from '../../../src/constants/themes.js';
import logo from '../../assets/svg/svarog.svg';

export default class HeaderToolbar {
  constructor({ onSelectTheme, initialTheme }) {
    this.onSelectTheme = onSelectTheme;

    this.header = document.createElement('header');
    this.header.className = 'header-toolbar';

    // Create branding section
    const branding = document.createElement('div');
    branding.className = 'header-toolbar__branding';

    this.logo = document.createElement('img');
    this.logo.src = logo;
    this.logo.alt = 'Svarog logo';
    this.logo.className = 'header-logo';

    this.title = document.createElement('h1');
    this.title.className = 'header-title';
    this.title.textContent = 'Svarog';

    branding.appendChild(this.logo);
    branding.appendChild(this.title);

    // Create controls section
    const controls = document.createElement('div');
    controls.className = 'header-toolbar__controls';

    this.themeSelector = document.createElement('select');
    this.themeSelector.className = 'theme-selector';

    Object.keys(THEMES).forEach((theme) => {
      const option = document.createElement('option');
      option.value = THEMES[theme];
      option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);

      if (THEMES[theme] === initialTheme) {
        option.selected = true;
      }

      this.themeSelector.appendChild(option);
    });

    this.themeSelector.addEventListener('change', () => {
      this.onSelectTheme(this.themeSelector.value);
    });

    controls.appendChild(this.themeSelector);

    // Assemble header
    this.header.appendChild(branding);
    this.header.appendChild(controls);
  }

  getElement() {
    return this.header;
  }
}
