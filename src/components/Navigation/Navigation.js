// src/components/Navigation/Navigation.js
import './Navigation.css';
import { Component } from '../../utils/componentFactory.js';

/**
 * Navigation component for creating site navigation
 * @extends Component
 */
export default class Navigation extends Component {
  /**
   * Creates a new Navigation instance
   *
   * @param {Object} props - Navigation properties
   * @param {Array} [props.items=[]] - Navigation items
   * @param {boolean} [props.responsive=true] - Whether navigation should be responsive
   * @param {string} [props.activeId=null] - ID of currently active item
   * @param {boolean} [props.horizontal=true] - Whether navigation should be horizontal
   * @param {boolean} [props.expandable=true] - Whether dropdown menus should be expandable
   * @param {Function} [props.onItemSelect=null] - Callback when an item is selected
   * @param {string} [props.className=''] - Additional CSS class names
   */
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
      expandedIds: new Set(),
    };

    this.element = this.createNavigationElement();
    this.setupEventListeners();
  }

  /**
   * Creates the navigation element
   * @private
   * @returns {HTMLElement} The navigation element
   */
  createNavigationElement() {
    // Build class names
    const classNames = this.createClassNames(
      'nav',
      {
        'nav--responsive': this.props.responsive,
        'nav--horizontal': this.props.horizontal,
        'nav--vertical': !this.props.horizontal,
        'nav--expandable': this.props.expandable,
      },
      this.props.className
    );

    // Create the main navigation element
    const nav = this.createElement('nav', {
      className: classNames,
      attributes: {
        role: 'navigation',
        'aria-label': 'Main navigation',
      },
    });

    // Create burger menu for mobile
    if (this.props.responsive) {
      const burger = this.createBurgerButton();
      nav.appendChild(burger);
    }

    // Create navigation list
    const navList = this.createNavigationList();
    nav.appendChild(navList);

    return nav;
  }

  /**
   * Creates the burger menu button for mobile navigation
   * @private
   * @returns {HTMLElement} The burger button element
   */
  createBurgerButton() {
    const button = this.createElement('button', {
      className: 'nav__burger',
      attributes: {
        'aria-label': 'Toggle navigation menu',
        'aria-expanded': 'false',
        'aria-controls': 'nav-menu',
      },
    });

    // Create burger button lines
    for (let i = 0; i < 3; i++) {
      const line = this.createElement('span', {
        className: 'nav__burger-line',
      });
      button.appendChild(line);
    }

    return button;
  }

  /**
   * Creates the navigation list with all items
   * @private
   * @returns {HTMLElement} The navigation list element
   */
  createNavigationList() {
    const list = this.createElement('ul', {
      className: 'nav__list',
      attributes: {
        id: 'nav-menu',
        role: 'menubar',
      },
    });

    // Create navigation items
    this.props.items.forEach((item) => {
      const navItem = this.createNavigationItem(item, 0);
      list.appendChild(navItem);
    });

    return list;
  }

  /**
   * Creates a navigation item
   * @private
   * @param {Object} item - The item data
   * @param {number} depth - Nesting depth
   * @returns {HTMLElement} The navigation item element
   */
  createNavigationItem(item, depth) {
    const hasChildren = Array.isArray(item.items) && item.items.length > 0;
    const isActive = this.state.activeId === item.id;
    const isExpanded = this.state.expandedIds.has(item.id);

    // Create item element
    const navItem = this.createElement('li', {
      className: this.createClassNames(
        'nav__item',
        `nav__item--depth-${depth}`,
        {
          'nav__item--active': isActive,
          'nav__item--expanded': isExpanded,
          'nav__item--has-children': hasChildren,
          'nav__item--disabled': item.disabled,
        }
      ),
      attributes: {
        role: 'none',
        'data-id': item.id,
      },
    });

    // Create link/button element
    const linkElement = this.createElement(
      hasChildren && this.props.expandable ? 'button' : 'a',
      {
        className: 'nav__link',
        attributes: {
          role: 'menuitem',
          ...(hasChildren
            ? {
                'aria-haspopup': 'true',
                'aria-expanded': isExpanded ? 'true' : 'false',
              }
            : {}),
          ...(item.disabled ? { 'aria-disabled': 'true' } : {}),
          ...(item.href && !hasChildren ? { href: item.href } : {}),
          ...(item.target
            ? { target: item.target, rel: 'noopener noreferrer' }
            : {}),
        },
      }
    );

    // Add link content
    const linkContent = this.createElement('span', {
      className: 'nav__link-content',
      textContent: item.label,
    });
    linkElement.appendChild(linkContent);

    // Add chevron if has children
    if (hasChildren) {
      const chevron = this.createElement('span', {
        className: 'nav__chevron',
      });
      linkElement.appendChild(chevron);
    }

    navItem.appendChild(linkElement);

    // Create submenu if has children
    if (hasChildren) {
      const submenu = this.createElement('ul', {
        className: 'nav__submenu',
        attributes: {
          role: 'menu',
          'aria-label': item.label,
        },
      });

      // Create child items
      item.items.forEach((childItem) => {
        const childElement = this.createNavigationItem(childItem, depth + 1);
        submenu.appendChild(childElement);
      });

      navItem.appendChild(submenu);
    }

    return navItem;
  }

  /**
   * Sets up all event listeners for the navigation
   * @private
   */
  setupEventListeners() {
    // Burger menu click
    const burgerButton = this.element.querySelector('.nav__burger');
    if (burgerButton) {
      burgerButton.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Item clicks
    this.element.addEventListener('click', (e) => {
      const navLink = e.target.closest('.nav__link');
      if (!navLink) return;

      const navItem = navLink.closest('.nav__item');
      if (!navItem) return;

      const itemId = navItem.dataset.id;
      const hasChildren = navItem.classList.contains('nav__item--has-children');

      // Toggle submenu if has children
      if (hasChildren && this.props.expandable) {
        e.preventDefault();
        this.toggleSubmenu(itemId);
      }

      // Set active item
      this.setActiveItem(itemId);

      // Call onItemSelect callback
      if (this.props.onItemSelect) {
        const item = this.findItemById(itemId);
        if (item) {
          this.props.onItemSelect(item);
        }
      }

      // Close mobile menu on item click
      if (this.state.isOpen && this.props.responsive) {
        this.closeMobileMenu();
      }
    });

    // Close menu on outside click
    if (this.props.responsive) {
      document.addEventListener('click', (e) => {
        if (this.state.isOpen && !this.element.contains(e.target)) {
          this.closeMobileMenu();
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
  }

  /**
   * Toggles the mobile menu open/closed state
   * @private
   */
  toggleMobileMenu() {
    if (this.state.isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Opens the mobile menu
   * @private
   */
  openMobileMenu() {
    this.state.isOpen = true;
    this.element.classList.add('nav--open');

    const burgerButton = this.element.querySelector('.nav__burger');
    if (burgerButton) {
      burgerButton.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * Closes the mobile menu
   * @private
   */
  closeMobileMenu() {
    this.state.isOpen = false;
    this.element.classList.remove('nav--open');

    const burgerButton = this.element.querySelector('.nav__burger');
    if (burgerButton) {
      burgerButton.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Toggles a submenu expanded/collapsed
   * @param {string} itemId - ID of the item to toggle
   * @private
   */
  toggleSubmenu(itemId) {
    const isExpanded = this.state.expandedIds.has(itemId);

    if (isExpanded) {
      this.state.expandedIds.delete(itemId);
    } else {
      this.state.expandedIds.add(itemId);
    }

    // Update DOM
    const navItem = this.element.querySelector(
      `.nav__item[data-id="${itemId}"]`
    );
    if (navItem) {
      navItem.classList.toggle('nav__item--expanded', !isExpanded);

      const navLink = navItem.querySelector('.nav__link');
      if (navLink) {
        navLink.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      }
    }
  }

  /**
   * Sets the active navigation item
   * @param {string} itemId - ID of the item to set as active
   * @private
   */
  setActiveItem(itemId) {
    if (this.state.activeId === itemId) return;

    this.state.activeId = itemId;

    // Remove existing active classes
    const activeItems = this.element.querySelectorAll('.nav__item--active');
    activeItems.forEach((item) => {
      item.classList.remove('nav__item--active');
    });

    // Add active class to new item
    const newActiveItem = this.element.querySelector(
      `.nav__item[data-id="${itemId}"]`
    );
    if (newActiveItem) {
      newActiveItem.classList.add('nav__item--active');
    }
  }

  /**
   * Finds an item by its ID in the navigation structure
   * @param {string} itemId - ID of the item to find
   * @returns {Object|null} The found item or null
   * @private
   */
  findItemById(itemId) {
    const findInItems = (items) => {
      for (const item of items) {
        if (item.id === itemId) {
          return item;
        }

        if (item.items && item.items.length > 0) {
          const found = findInItems(item.items);
          if (found) return found;
        }
      }

      return null;
    };

    return findInItems(this.props.items);
  }

  /**
   * Gets the navigation element
   * @returns {HTMLElement} The navigation element
   */
  getElement() {
    return this.element;
  }
}
