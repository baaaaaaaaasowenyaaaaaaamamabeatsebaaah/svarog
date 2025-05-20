// src/components/Navigation/Navigation.js
import './Navigation.css';
import {
  createComponent,
  createElement,
  validateProps,
} from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { withThemeAwareness } from '../../utils/composition.js';
import { debounce } from '../../utils/performance.js';

/**
 * Creates a Navigation component
 * @param {Object} props - Navigation properties
 * @param {Array} props.items - Navigation items
 * @param {boolean} [props.responsive=true] - Whether navigation is responsive
 * @param {string|null} [props.activeId=null] - ID of the active navigation item
 * @param {boolean} [props.horizontal=true] - Whether navigation is horizontal
 * @param {boolean} [props.expandable=true] - Whether submenus can be expanded
 * @param {Function} [props.onItemSelect=null] - Callback when item is selected
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {string} [props.burgerPosition='left'] - Burger menu position ('left' or 'right')
 * @param {boolean} [props.submenuShadow=false] - Whether to add shadow to submenus
 * @returns {Object} Navigation component API
 */
const createNavigation = (props) => {
  // Validate required props
  validateProps(props, ['items'], 'Navigation');

  // Set default props
  const initialProps = {
    items: [],
    responsive: true,
    activeId: null,
    horizontal: true,
    expandable: true,
    onItemSelect: null,
    className: '',
    burgerPosition: 'left',
    submenuShadow: false,
    ...props,
  };

  // Internal state
  const state = {
    isOpen: false,
    activeId: initialProps.activeId,
    expandedId: null,
    ...initialProps,
  };

  // Event handler references (for cleanup)
  let documentClickHandler = null;
  let documentKeyHandler = null;
  let windowResizeHandler = null;

  /**
   * Create navigation class names
   * @param {string} baseClass - Base class name
   * @param {Object} conditionalClasses - Object with class names as keys and conditions as values
   * @param {string} additionalClasses - Additional class names
   * @returns {string} Combined class names
   */
  const createClassNames = (
    baseClass,
    conditionalClasses = {},
    additionalClasses = ''
  ) => {
    const classNames = [baseClass];

    Object.entries(conditionalClasses).forEach(([className, condition]) => {
      if (condition) {
        classNames.push(className);
      }
    });

    if (additionalClasses) {
      classNames.push(additionalClasses);
    }

    return classNames.join(' ');
  };

  /**
   * Find item by ID in the navigation tree
   * @param {string} itemId - Item ID to find
   * @returns {Object|null} Found item or null
   */
  const findItemById = (itemId) => {
    if (!itemId) return null;

    const find = (items) => {
      for (const item of items) {
        if (item.id === itemId) return item;
        if (item.items && item.items.length > 0) {
          const found = find(item.items);
          if (found) return found;
        }
      }
      return null;
    };
    return find(state.items);
  };

  /**
   * Create a navigation item
   * @param {Object} item - Item data
   * @returns {HTMLElement} Navigation item element
   */
  const createNavigationItem = (item) => {
    if (!item || !item.id || !item.label) {
      console.warn('Navigation: Invalid item', item);
      return document.createDocumentFragment();
    }

    const hasChildren = Array.isArray(item.items) && item.items.length > 0;
    const isActive = state.activeId === item.id;
    const isExpanded = state.expandedId === item.id;

    const navItem = createElement('li', {
      classes: createClassNames('nav__item', {
        'nav__item--active': isActive,
        'nav__item--expanded': isExpanded,
        'nav__item--has-children': hasChildren,
        'nav__item--disabled': !!item.disabled,
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

    const linkElement = createElement(
      hasChildren && state.expandable ? 'button' : 'a',
      {
        classes: 'nav__link',
        attributes: linkAttributes,
        text: item.label,
      }
    );

    navItem.appendChild(linkElement);

    // Create submenu if has children
    if (hasChildren) {
      // Create empty submenu container
      const submenu = createElement('ul', {
        classes: 'nav__submenu',
        attributes: { role: 'menu' },
      });

      // Only populate submenu if expanded or first render
      if (isExpanded) {
        // Use DocumentFragment for batch DOM operations
        const fragment = document.createDocumentFragment();

        item.items.forEach((childItem) => {
          fragment.appendChild(createNavigationItem(childItem));
        });

        submenu.appendChild(fragment);
      }

      navItem.appendChild(submenu);
    }

    return navItem;
  };

  /**
   * Toggle mobile menu state
   */
  const toggleMobileMenu = (element) => {
    state.isOpen = !state.isOpen;
    element.classList.toggle('nav--open', state.isOpen);

    // Update aria-expanded on burger button
    const burger = element.querySelector('.nav__burger');
    if (burger) {
      burger.setAttribute('aria-expanded', state.isOpen ? 'true' : 'false');
    }

    return element;
  };

  /**
   * Close mobile menu
   */
  const closeMobileMenu = (element) => {
    if (!state.isOpen) return element;

    state.isOpen = false;
    element.classList.remove('nav--open');

    // Update aria-expanded on burger button
    const burger = element.querySelector('.nav__burger');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
    }

    return element;
  };

  /**
   * Update expanded states in the navigation
   */
  const updateExpandedStates = (element) => {
    const items = element.querySelectorAll('.nav__item--has-children');
    items.forEach((item) => {
      const isExpanded = item.dataset.id === state.expandedId;
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
          const itemData = findItemById(item.dataset.id);
          if (itemData && itemData.items) {
            // Use DocumentFragment for batch DOM operations
            const fragment = document.createDocumentFragment();

            itemData.items.forEach((childItem) => {
              fragment.appendChild(createNavigationItem(childItem));
            });

            submenu.appendChild(fragment);
          }
        }
      }
    });

    return element;
  };

  /**
   * Update active states in the navigation
   */
  const updateActiveStates = (element) => {
    const items = element.querySelectorAll('.nav__item');
    items.forEach((item) => {
      item.classList.toggle(
        'nav__item--active',
        item.dataset.id === state.activeId
      );
    });

    return element;
  };

  /**
   * Handle navigation click events
   */
  const handleClick = (e, element) => {
    // Handle burger menu click
    if (e.target.closest('.nav__burger')) {
      e.stopPropagation();
      toggleMobileMenu(element);
      return;
    }

    // Handle nav link click
    const navLink = e.target.closest('.nav__link');
    if (!navLink) return;

    const navItem = navLink.closest('.nav__item');
    if (!navItem) return;

    // Skip if disabled
    if (navItem.classList.contains('nav__item--disabled')) {
      e.preventDefault();
      return;
    }

    const itemId = navItem.dataset.id;
    const hasChildren = navItem.classList.contains('nav__item--has-children');

    if (hasChildren && state.expandable) {
      e.preventDefault();
      // Toggle submenu - if clicking the same item, close it. Otherwise open the new one.
      state.expandedId = state.expandedId === itemId ? null : itemId;
      updateExpandedStates(element);
    } else {
      // Close any open submenu when clicking non-parent items
      state.expandedId = null;
      updateExpandedStates(element);
    }

    // Set active item
    state.activeId = itemId;
    updateActiveStates(element);

    // Callback
    if (state.onItemSelect) {
      const item = findItemById(itemId);
      if (item) state.onItemSelect(item);
    }

    // Close mobile menu on item click
    if (state.isOpen && state.responsive && !hasChildren) {
      closeMobileMenu(element);
    }
  };

  /**
   * Set up event listeners for the navigation
   */
  const setupEventListeners = (element) => {
    // Click event listener for delegation
    element.addEventListener('click', (e) => handleClick(e, element));

    // Close menu on outside click
    documentClickHandler = (e) => {
      if (!element.contains(e.target)) {
        if (state.isOpen) {
          closeMobileMenu(element);
        }
        if (state.expandedId) {
          state.expandedId = null;
          updateExpandedStates(element);
        }
      }
    };
    document.addEventListener('click', documentClickHandler);

    // Close menu on escape key
    documentKeyHandler = (e) => {
      if (e.key === 'Escape') {
        if (state.isOpen) {
          closeMobileMenu(element);
        }
        if (state.expandedId) {
          const expandedId = state.expandedId;
          state.expandedId = null;
          updateExpandedStates(element);
          // Return focus to the parent item
          const parentItem = element.querySelector(
            `.nav__item[data-id="${expandedId}"] > .nav__link`
          );
          if (parentItem) {
            parentItem.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', documentKeyHandler);

    // Handle window resize with debounce
    windowResizeHandler = debounce(() => {
      if (window.innerWidth > 768 && state.isOpen) {
        closeMobileMenu(element);
      }
    }, 100);

    window.addEventListener('resize', windowResizeHandler, { passive: true });
  };

  /**
   * Create the navigation element
   */
  const renderNavigation = () => {
    const classNames = createClassNames(
      'nav',
      {
        'nav--responsive': state.responsive,
        'nav--vertical': !state.horizontal,
        'nav--horizontal': state.horizontal,
        'nav--submenu-shadow': state.submenuShadow,
        [`nav--burger-${state.burgerPosition}`]: state.responsive,
        'nav--open': state.isOpen,
      },
      state.className
    );

    const nav = createElement('nav', {
      classes: classNames,
      attributes: { role: 'navigation' },
    });

    // Create burger menu for mobile
    if (state.responsive) {
      const burger = createElement('button', {
        classes: 'nav__burger',
        attributes: {
          'aria-label': 'Toggle navigation menu',
          'aria-expanded': state.isOpen ? 'true' : 'false',
          type: 'button',
        },
      });

      for (let i = 0; i < 3; i++) {
        burger.appendChild(
          createElement('span', { classes: 'nav__burger-line' })
        );
      }

      nav.appendChild(burger);
    }

    // Create navigation list
    const navList = createElement('ul', {
      classes: 'nav__list',
      attributes: { role: 'menubar' },
    });

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    state.items.forEach((item) => {
      fragment.appendChild(createNavigationItem(item));
    });

    navList.appendChild(fragment);
    nav.appendChild(navList);

    return nav;
  };

  // Create the component using baseComponent
  const component = createBaseComponent(renderNavigation)(state);

  // Add cleanup method to remove event listeners
  const originalDestroy = component.destroy;
  component.destroy = () => {
    if (documentClickHandler) {
      document.removeEventListener('click', documentClickHandler);
      documentClickHandler = null;
    }
    if (documentKeyHandler) {
      document.removeEventListener('keydown', documentKeyHandler);
      documentKeyHandler = null;
    }
    if (windowResizeHandler) {
      window.removeEventListener('resize', windowResizeHandler);
      windowResizeHandler = null;
    }
    if (originalDestroy) {
      originalDestroy();
    }
  };

  // Setup events after initial render
  const element = component.getElement();
  setupEventListeners(element);

  // Add methods specific to Navigation
  component.setActiveItem = (itemId) => {
    state.activeId = itemId;
    updateActiveStates(component.getElement());
    return component;
  };

  component.toggleMobileMenu = () => {
    toggleMobileMenu(component.getElement());
    return component;
  };

  component.closeMobileMenu = () => {
    closeMobileMenu(component.getElement());
    return component;
  };

  component.expandItem = (itemId) => {
    state.expandedId = itemId;
    updateExpandedStates(component.getElement());
    return component;
  };

  component.collapseAll = () => {
    state.expandedId = null;
    updateExpandedStates(component.getElement());
    return component;
  };

  // Add shouldRerender method for better update performance
  component.shouldRerender = (newProps) => {
    // Only trigger full rerender for significant structure changes
    return (
      newProps.items !== undefined ||
      newProps.horizontal !== undefined ||
      newProps.responsive !== undefined
    );
  };

  // Add partialUpdate method for more efficient DOM updates
  component.partialUpdate = (element, newProps) => {
    let needsActiveUpdate = false;
    let needsExpandedUpdate = false;

    // Update internal state based on new props
    Object.entries(newProps).forEach(([key, value]) => {
      if (key === 'activeId' && value !== state.activeId) {
        state[key] = value;
        needsActiveUpdate = true;
      } else if (key === 'expandedId' && value !== state.expandedId) {
        state[key] = value;
        needsExpandedUpdate = true;
      } else if (key === 'isOpen' && state.responsive) {
        if (value && !state.isOpen) {
          toggleMobileMenu(element);
        } else if (!value && state.isOpen) {
          closeMobileMenu(element);
        }
      } else if (key === 'className') {
        // Update className directly without rerendering
        const oldClasses = state.className.split(' ').filter(Boolean);
        const newClasses = value.split(' ').filter(Boolean);

        oldClasses.forEach((cls) => {
          if (!newClasses.includes(cls)) {
            element.classList.remove(cls);
          }
        });

        newClasses.forEach((cls) => {
          if (!oldClasses.includes(cls)) {
            element.classList.add(cls);
          }
        });

        state.className = value;
      } else if (key === 'submenuShadow') {
        element.classList.toggle('nav--submenu-shadow', value);
        state.submenuShadow = value;
      } else if (key === 'burgerPosition' && state.responsive) {
        element.classList.remove(`nav--burger-${state.burgerPosition}`);
        element.classList.add(`nav--burger-${value}`);
        state.burgerPosition = value;
      } else {
        // Update other state properties
        state[key] = value;
      }
    });

    // Apply DOM updates if needed
    if (needsActiveUpdate) {
      updateActiveStates(element);
    }

    if (needsExpandedUpdate) {
      updateExpandedStates(element);
    }

    return component;
  };

  // Add theme change handler
  component.onThemeChange = (theme, previousTheme) => {
    // Theme changes are handled through CSS variables, no manual updates needed
    console.debug(
      `Navigation: theme changed from ${previousTheme} to ${theme}`
    );
  };

  return component;
};

// Specify required props for validation
createNavigation.requiredProps = ['items'];

// Create component with theme awareness
export default createComponent(
  'Navigation',
  withThemeAwareness(createNavigation)
);
