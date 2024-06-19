import './Navigation.css';

export class NavItem {
  constructor({ label, href }) {
    this.label = label;
    this.href = href;
    this.item = document.createElement('li');
    this.link = document.createElement('a');
    this.link.href = this.href;
    this.link.textContent = this.label;
    this.item.appendChild(this.link);
  }

  getElement() {
    return this.item;
  }
}

export class Navigation {
  constructor({ items, theme }) {
    this.items = items;
    this.theme = theme;
    this.nav = document.createElement('nav');
    this.nav.className = `navigation ${theme}`;
    this.ul = document.createElement('ul');
    this.ul.className = 'navigation-list';
    this.burgerButton = this.createBurgerButton();
    this.nav.appendChild(this.burgerButton);
    this.nav.appendChild(this.ul);
    this.appendItems();
    this.addBurgerMenuFunctionality();
  }

  createBurgerButton() {
    const button = document.createElement('button');
    button.className = 'burger-button';
    button.innerHTML = '&#9776;'; // Unicode for burger menu
    return button;
  }

  appendItems() {
    this.items.forEach((item) => {
      const navItem = new NavItem(item);
      this.ul.appendChild(navItem.getElement());
    });
  }

  addBurgerMenuFunctionality() {
    this.burgerButton.addEventListener('click', () => {
      this.ul.classList.toggle('active');
    });
  }

  getElement() {
    return this.nav;
  }
}
