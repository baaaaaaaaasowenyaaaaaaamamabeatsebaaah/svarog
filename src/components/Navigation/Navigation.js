// src/components/Navigation/Navigation.js
import './Navigation.css';
import NavigationList from './NavigationList.js';

export default class Navigation {
  constructor({
    items = [],
    responsive = true,
    activeId = null,
    theme = 'default',
    expandedIds = [],
  }) {
    this.config = {
      items,
      responsive,
      activeId,
      theme,
      expandedIds,
    };

    this.isOpen = false;
    this.element = this.createElement();

    if (responsive) {
      this.setupResponsiveHandling();
    }
  }

  createElement() {
    const nav = document.createElement('nav');
    nav.className = this.getNavigationClassNames();
    nav.setAttribute('role', 'navigation');

    // Create burger menu for mobile
    if (this.config.responsive) {
      const burger = this.createBurgerButton();
      nav.appendChild(burger);
    }

    // Create main navigation list
    const navigationList = new NavigationList({
      items: this.config.items,
      onSelect: this.handleItemSelect.bind(this),
    });
    nav.appendChild(navigationList.getElement());

    return nav;
  }

  createBurgerButton() {
    const button = document.createElement('button');
    button.className = 'nav-burger';
    button.setAttribute('aria-label', 'Toggle navigation menu');
    button.innerHTML = `
      <span class="nav-burger__line"></span>
      <span class="nav-burger__line"></span>
      <span class="nav-burger__line"></span>
    `;

    button.addEventListener('click', () => this.toggleMobileMenu());
    return button;
  }

  setupResponsiveHandling() {
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (this.isOpen && !this.element.contains(event.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isOpen ? this.closeMobileMenu() : this.openMobileMenu();
  }

  openMobileMenu() {
    this.isOpen = true;
    this.element.classList.add('nav--open');
    this.element
      .querySelector('.nav-burger')
      .setAttribute('aria-expanded', 'true');

    // Trap focus within mobile menu
    this.trapFocus();
  }

  closeMobileMenu() {
    this.isOpen = false;
    this.element.classList.remove('nav--open');
    this.element
      .querySelector('.nav-burger')
      .setAttribute('aria-expanded', 'false');

    // Remove focus trap
    this.removeFocusTrap();
  }

  trapFocus() {
    const focusableElements = this.element.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  removeFocusTrap() {
    // Remove keydown event listener
    this.element.removeEventListener('keydown', this.trapFocus);
  }

  handleItemSelect(item) {
    // Handle active state
    if (this.config.activeId !== item.id) {
      this.config.activeId = item.id;
      this.updateActiveState();
    }

    // Close mobile menu if open
    if (this.config.responsive && this.isOpen) {
      this.closeMobileMenu();
    }
  }

  updateActiveState() {
    // Remove existing active states
    this.element
      .querySelectorAll('.nav-item--active')
      .forEach((el) => el.classList.remove('nav-item--active'));

    // Add active state to current item
    if (this.config.activeId) {
      const activeItem = this.element.querySelector(
        `[data-id="${this.config.activeId}"]`
      );
      if (activeItem) {
        activeItem.classList.add('nav-item--active');
      }
    }
  }

  getNavigationClassNames() {
    const classNames = ['nav'];
    if (this.config.responsive) classNames.push('nav--responsive');
    if (this.config.theme) classNames.push(`nav--theme-${this.config.theme}`);
    return classNames.join(' ');
  }

  getElement() {
    return this.element;
  }
}
