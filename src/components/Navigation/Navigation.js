// src/components/Navigation/Navigation.js
import './Navigation.css';
import { Component } from '../../utils/componentFactory.js';

export default class Navigation extends Component {
  constructor({
    items = [],
    responsive = true,
    activeId = null,
    horizontal = true,
    expandable = true,
    onItemSelect = null,
    className = '',
  }) {
    super();

    this.props = {
      items,
      responsive,
      activeId,
      horizontal,
      expandable,
      onItemSelect,
      className,
    };

    this.state = {
      isOpen: false,
      activeId: this.props.activeId,
      expandedId: null, // Only one submenu open at a time
    };

    this.element = this.createNavigationElement();
    this.setupEventListeners();
  }

  createNavigationElement() {
    const classNames = this.createClassNames(
      'nav',
      {
        'nav--responsive': this.props.responsive,
        'nav--vertical': !this.props.horizontal,
      },
      this.props.className
    );

    const nav = this.createElement('nav', {
      className: classNames,
      attributes: { role: 'navigation' },
    });

    // Create burger menu for mobile
    if (this.props.responsive) {
      const burger = this.createElement('button', {
        className: 'nav__burger',
        attributes: { 'aria-label': 'Toggle navigation menu' },
      });

      for (let i = 0; i < 3; i++) {
        burger.appendChild(
          this.createElement('span', { className: 'nav__burger-line' })
        );
      }

      nav.appendChild(burger);
    }

    // Create navigation list
    const navList = this.createElement('ul', {
      className: 'nav__list',
      attributes: { role: 'menubar' },
    });

    this.props.items.forEach((item) => {
      navList.appendChild(this.createNavigationItem(item));
    });

    nav.appendChild(navList);

    return nav;
  }

  createNavigationItem(item) {
    const hasChildren = Array.isArray(item.items) && item.items.length > 0;
    const isActive = this.state.activeId === item.id;
    const isExpanded = this.state.expandedId === item.id;

    const navItem = this.createElement('li', {
      className: this.createClassNames('nav__item', {
        'nav__item--active': isActive,
        'nav__item--expanded': isExpanded,
        'nav__item--has-children': hasChildren,
        'nav__item--disabled': item.disabled,
      }),
      attributes: { 'data-id': item.id },
    });

    const linkElement = this.createElement(
      hasChildren && this.props.expandable ? 'button' : 'a',
      {
        className: 'nav__link',
        attributes: {
          ...(item.href && !hasChildren ? { href: item.href } : {}),
          ...(item.disabled ? { 'aria-disabled': 'true' } : {}),
        },
        textContent: item.label,
      }
    );

    navItem.appendChild(linkElement);

    // Create submenu if has children
    if (hasChildren) {
      const submenu = this.createElement('ul', {
        className: 'nav__submenu',
        attributes: { role: 'menu' },
      });

      item.items.forEach((childItem) => {
        submenu.appendChild(this.createNavigationItem(childItem));
      });

      navItem.appendChild(submenu);
    }

    return navItem;
  }

  setupEventListeners() {
    const burger = this.element.querySelector('.nav__burger');
    if (burger) {
      burger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
    }

    this.element.addEventListener('click', (e) => {
      const navLink = e.target.closest('.nav__link');
      if (!navLink) return;

      const navItem = navLink.closest('.nav__item');
      if (!navItem) return;

      const itemId = navItem.dataset.id;
      const hasChildren = navItem.classList.contains('nav__item--has-children');

      if (hasChildren && this.props.expandable) {
        e.preventDefault();
        // Toggle submenu - if clicking the same item, close it. Otherwise open the new one.
        this.state.expandedId =
          this.state.expandedId === itemId ? null : itemId;
        this.updateExpandedStates();
      } else {
        // Close any open submenu when clicking non-parent items
        this.state.expandedId = null;
        this.updateExpandedStates();
      }

      // Set active item
      this.state.activeId = itemId;
      this.updateActiveStates();

      // Callback
      if (this.props.onItemSelect) {
        const item = this.findItemById(itemId);
        if (item) this.props.onItemSelect(item);
      }

      // Close mobile menu on item click
      if (this.state.isOpen && this.props.responsive && !hasChildren) {
        this.closeMobileMenu();
      }
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        if (this.state.isOpen) {
          this.closeMobileMenu();
        }
        if (this.state.expandedId) {
          this.state.expandedId = null;
          this.updateExpandedStates();
        }
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isOpen) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.state.isOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.state.isOpen = !this.state.isOpen;
    this.element.classList.toggle('nav--open', this.state.isOpen);
  }

  closeMobileMenu() {
    this.state.isOpen = false;
    this.element.classList.remove('nav--open');
  }

  updateExpandedStates() {
    const items = this.element.querySelectorAll('.nav__item');
    items.forEach((item) => {
      const isExpanded = item.dataset.id === this.state.expandedId;
      item.classList.toggle('nav__item--expanded', isExpanded);
    });
  }

  updateActiveStates() {
    const items = this.element.querySelectorAll('.nav__item');
    items.forEach((item) => {
      const isActive = item.dataset.id === this.state.activeId;
      item.classList.toggle('nav__item--active', isActive);
    });
  }

  findItemById(itemId) {
    const find = (items) => {
      for (const item of items) {
        if (item.id === itemId) return item;
        if (item.items) {
          const found = find(item.items);
          if (found) return found;
        }
      }
      return null;
    };
    return find(this.props.items);
  }

  getElement() {
    return this.element;
  }
}
