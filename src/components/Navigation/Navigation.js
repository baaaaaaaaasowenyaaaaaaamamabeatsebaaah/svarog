import Link from '../Link/Link';
import './Navigation.css';

export class NavItem {
  constructor({ label, href, onClick }) {
    this.label = label;
    this.href = href;
    this.item = document.createElement('li');
    this.link = new Link({
      href: this.href,
      children: this.label,
    }).getElement();
    this.link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent the default anchor behavior
      onClick(); // Call the provided onClick handler
    });
    this.item.appendChild(this.link);
  }

  getElement() {
    return this.item;
  }
}

export class Navigation {
  constructor({ items }) {
    this.items = items;
    this.nav = document.createElement('nav');
    this.nav.className = `navigation`;
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
