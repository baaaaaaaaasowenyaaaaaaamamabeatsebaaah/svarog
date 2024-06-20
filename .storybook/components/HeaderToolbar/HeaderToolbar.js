import './HeaderToolbar.css';
import { THEMES } from '../../../src/constants/themes';
import logo from '../../../assets/svarog.svg'; // Adjust the path if necessary

export default class HeaderToolbar {
  constructor({ onSelectTheme }) {
    this.onSelectTheme = onSelectTheme;

    this.header = document.createElement('header');
    this.header.className = 'header-toolbar';

    this.logo = document.createElement('img');
    this.logo.src = logo;
    this.logo.alt = 'svarog logo';
    this.logo.className = 'header-logo'; // You can define styles for the logo in the CSS

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
