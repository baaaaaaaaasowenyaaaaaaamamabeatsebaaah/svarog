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
    burgerPosition = 'left',
    submenuShadow = false,
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
      burgerPosition,
      submenuShadow,
    };

    this.state = {
      isOpen: false,
      activeId: this.props.activeId,
      expandedId: null, // Only one submenu open at a time
    };

    this._initialized = false;
    this.element = this.createNavigationElement();
    this.setupEventListeners();
  }

  createNavigationElement() {
    const classNames = this.createClassNames(
      'nav',
      {
        'nav--responsive': this.props.responsive,
        'nav--vertical': !this.props.horizontal,
        'nav--horizontal': this.props.horizontal,
        'nav--submenu-shadow': this.props.submenuShadow,
        [`nav--burger-${this.props.burgerPosition}`]: this.props.responsive,
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
        attributes: {
          'aria-label': 'Toggle navigation menu',
          'aria-expanded': 'false',
        },
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

    this._initialized = true;
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

    const linkAttributes = {
      ...(item.href && !hasChildren ? { href: item.href } : {}),
      ...(item.disabled ? { 'aria-disabled': 'true' } : {}),
      ...(hasChildren
        ? {
            'aria-expanded': isExpanded ? 'true' : 'false',
            'aria-haspopup': 'true',
          }
        : {}),
    };

    const linkElement = this.createElement(
      hasChildren && this.props.expandable ? 'button' : 'a',
      {
        className: 'nav__link',
        attributes: linkAttributes,
        textContent: item.label,
      }
    );

    navItem.appendChild(linkElement);

    // Create submenu if has children
    if (hasChildren) {
      // Only create submenu content if it's expanded or first render
      // This lazy-loads submenu content only when needed
      if (isExpanded || !this._initialized) {
        const submenu = this.createElement('ul', {
          className: 'nav__submenu',
          attributes: { role: 'menu' },
        });

        // Use DocumentFragment for batch DOM operations
        const fragment = document.createDocumentFragment();

        item.items.forEach((childItem) => {
          fragment.appendChild(this.createNavigationItem(childItem));
        });

        submenu.appendChild(fragment);
        navItem.appendChild(submenu);
      } else {
        // Just create an empty submenu container - we'll populate it when expanded
        const submenu = this.createElement('ul', {
          className: 'nav__submenu',
          attributes: { role: 'menu' },
        });
        navItem.appendChild(submenu);
      }
    }

    return navItem;
  }

  setupEventListeners() {
    // Replace multiple event listeners with delegation
    this.element.addEventListener('click', this.handleClick.bind(this));

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
      if (e.key === 'Escape') {
        if (this.state.isOpen) {
          this.closeMobileMenu();
        }
        if (this.state.expandedId) {
          const expandedId = this.state.expandedId;
          this.state.expandedId = null;
          this.updateExpandedStates();
          // Return focus to the parent item
          const parentItem = this.element.querySelector(
            `.nav__item[data-id="${expandedId}"] > .nav__link`
          );
          if (parentItem) {
            parentItem.focus();
          }
        }
      }
    });

    // Handle window resize with debounce
    window.addEventListener(
      'resize',
      this.debounce(() => {
        if (window.innerWidth > 768 && this.state.isOpen) {
          this.closeMobileMenu();
        }
      }, 100),
      { passive: true }
    );
  }

  // New delegated click handler
  handleClick(e) {
    // Handle burger menu click
    if (e.target.closest('.nav__burger')) {
      e.stopPropagation();
      this.toggleMobileMenu();
      return;
    }

    // Handle nav link click
    const navLink = e.target.closest('.nav__link');
    if (!navLink) return;

    const navItem = navLink.closest('.nav__item');
    if (!navItem) return;

    const itemId = navItem.dataset.id;
    const hasChildren = navItem.classList.contains('nav__item--has-children');

    if (hasChildren && this.props.expandable) {
      e.preventDefault();
      // Toggle submenu - if clicking the same item, close it. Otherwise open the new one.
      this.state.expandedId = this.state.expandedId === itemId ? null : itemId;
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
  }

  // Add debounce utility method
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  toggleMobileMenu() {
    this.state.isOpen = !this.state.isOpen;
    this.element.classList.toggle('nav--open', this.state.isOpen);

    // Update aria-expanded on burger button
    const burger = this.element.querySelector('.nav__burger');
    if (burger) {
      burger.setAttribute(
        'aria-expanded',
        this.state.isOpen ? 'true' : 'false'
      );
    }
  }

  closeMobileMenu() {
    this.state.isOpen = false;
    this.element.classList.remove('nav--open');

    // Update aria-expanded on burger button
    const burger = this.element.querySelector('.nav__burger');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
    }
  }

  updateExpandedStates() {
    const items = this.element.querySelectorAll('.nav__item--has-children');
    items.forEach((item) => {
      const isExpanded = item.dataset.id === this.state.expandedId;
      item.classList.toggle('nav__item--expanded', isExpanded);

      // Update aria-expanded attribute on the link/button
      const link = item.querySelector('.nav__link');
      if (link) {
        link.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      }

      // If this item is now expanded and has an empty submenu, populate it
      if (isExpanded) {
        const submenu = item.querySelector('.nav__submenu');
        if (submenu && submenu.children.length === 0) {
          // Find the corresponding item data
          const itemData = this.findItemById(item.dataset.id);
          if (itemData && itemData.items) {
            // Use DocumentFragment for batch DOM operations
            const fragment = document.createDocumentFragment();

            itemData.items.forEach((childItem) => {
              fragment.appendChild(this.createNavigationItem(childItem));
            });

            submenu.appendChild(fragment);
          }
        }
      }
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
