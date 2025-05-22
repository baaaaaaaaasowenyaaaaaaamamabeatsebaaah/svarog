// src/components/Navigation/Navigation.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Navigation from './Navigation.js';

describe('Navigation component', () => {
  // Sample navigation items for testing
  const navItems = [
    { id: 'home', label: 'Home', href: '#' },
    {
      id: 'products',
      label: 'Products',
      href: '#',
      items: [
        { id: 'product1', label: 'Product 1', href: '#product1' },
        { id: 'product2', label: 'Product 2', href: '#product2' },
      ],
    },
    { id: 'about', label: 'About', href: '#' },
    { id: 'disabled', label: 'Disabled', href: '#', disabled: true },
  ];

  // Mock document methods
  beforeEach(() => {
    // Setup document body for DOM testing
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a navigation element', () => {
    const navigation = Navigation({ items: navItems });

    const element = navigation.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('nav');
    expect(element.className).toContain('nav');
  });

  it('should create correct number of navigation items', () => {
    const navigation = Navigation({ items: navItems });

    const element = navigation.getElement();
    const topLevelItems = element.querySelectorAll('.nav__list > .nav__item');
    expect(topLevelItems.length).toBe(navItems.length);
  });

  it('should create submenus for items with children', () => {
    const navigation = Navigation({ items: navItems });

    const element = navigation.getElement();
    const productItem = element.querySelector(`.nav__item[data-id="products"]`);
    expect(productItem).not.toBeNull();
    expect(productItem.classList.contains('nav__item--has-children')).toBe(
      true
    );

    const submenu = productItem.querySelector('.nav__submenu');
    expect(submenu).not.toBeNull();
  });

  it('should mark items as disabled', () => {
    const navigation = Navigation({ items: navItems });

    const element = navigation.getElement();
    const disabledItem = element.querySelector(
      `.nav__item[data-id="disabled"]`
    );
    expect(disabledItem).not.toBeNull();
    expect(disabledItem.classList.contains('nav__item--disabled')).toBe(true);

    const disabledLink = disabledItem.querySelector('.nav__link');
    expect(disabledLink.getAttribute('aria-disabled')).toBe('true');
  });

  it('should create burger menu for responsive navigation', () => {
    const navigation = Navigation({ items: navItems, responsive: true });

    const element = navigation.getElement();
    const burgerButton = element.querySelector('.nav__burger');
    expect(burgerButton).not.toBeNull();
    expect(burgerButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('should not create burger menu when responsive is false', () => {
    const navigation = Navigation({ items: navItems, responsive: false });

    const element = navigation.getElement();
    const burgerButton = element.querySelector('.nav__burger');
    expect(burgerButton).toBeNull();
  });

  it('should toggle mobile menu when burger is clicked', () => {
    const navigation = Navigation({ items: navItems, responsive: true });
    document.body.appendChild(navigation.getElement());

    const element = navigation.getElement();
    const burgerButton = element.querySelector('.nav__burger');

    // Initially closed
    expect(element.classList.contains('nav--open')).toBe(false);

    // Click to open
    burgerButton.click();
    expect(element.classList.contains('nav--open')).toBe(true);
    expect(burgerButton.getAttribute('aria-expanded')).toBe('true');

    // Click to close
    burgerButton.click();
    expect(element.classList.contains('nav--open')).toBe(false);
    expect(burgerButton.getAttribute('aria-expanded')).toBe('false');

    document.body.removeChild(element);
  });

  it('should toggle submenu when clicking on an item with children', () => {
    const navigation = Navigation({ items: navItems });
    document.body.appendChild(navigation.getElement());

    const element = navigation.getElement();
    const productItem = element.querySelector(`.nav__item[data-id="products"]`);
    const productLink = productItem.querySelector('.nav__link');

    // Initially closed
    expect(productItem.classList.contains('nav__item--expanded')).toBe(false);
    expect(productLink.getAttribute('aria-expanded')).toBe('false');

    // Click to expand
    productLink.click();
    expect(productItem.classList.contains('nav__item--expanded')).toBe(true);
    expect(productLink.getAttribute('aria-expanded')).toBe('true');

    // Click to collapse
    productLink.click();
    expect(productItem.classList.contains('nav__item--expanded')).toBe(false);
    expect(productLink.getAttribute('aria-expanded')).toBe('false');

    document.body.removeChild(element);
  });

  it('should set active item when clicking on a navigation item', () => {
    const navigation = Navigation({ items: navItems });
    document.body.appendChild(navigation.getElement());

    const element = navigation.getElement();
    const aboutItem = element.querySelector(`.nav__item[data-id="about"]`);
    const aboutLink = aboutItem.querySelector('.nav__link');

    // Initially not active
    expect(aboutItem.classList.contains('nav__item--active')).toBe(false);

    // Click to activate
    aboutLink.click();
    expect(aboutItem.classList.contains('nav__item--active')).toBe(true);

    document.body.removeChild(element);
  });

  it('should call onItemSelect callback when an item is clicked', () => {
    const onItemSelect = vi.fn();
    const navigation = Navigation({
      items: navItems,
      onItemSelect,
    });
    document.body.appendChild(navigation.getElement());

    const element = navigation.getElement();
    const homeItem = element.querySelector(`.nav__item[data-id="home"]`);
    const homeLink = homeItem.querySelector('.nav__link');

    // Click on home item
    homeLink.click();

    expect(onItemSelect).toHaveBeenCalledTimes(1);
    expect(onItemSelect).toHaveBeenCalledWith(navItems[0]); // home item

    document.body.removeChild(element);
  });

  it('should add horizontal class when horizontal is true', () => {
    const navigation = Navigation({
      items: navItems,
      horizontal: true,
    });

    const element = navigation.getElement();
    expect(element.classList.contains('nav--horizontal')).toBe(true);
    expect(element.classList.contains('nav--vertical')).toBe(false);
  });

  it('should add vertical class when horizontal is false', () => {
    const navigation = Navigation({
      items: navItems,
      horizontal: false,
    });

    const element = navigation.getElement();
    expect(element.classList.contains('nav--horizontal')).toBe(false);
    expect(element.classList.contains('nav--vertical')).toBe(true);
  });

  it('should properly clean up event listeners when destroyed', () => {
    const navigation = Navigation({ items: navItems });
    const element = navigation.getElement();
    document.body.appendChild(element);

    // Mock removeEventListener to verify it's called
    const docRemoveEventListener = vi.spyOn(document, 'removeEventListener');
    const windowRemoveEventListener = vi.spyOn(window, 'removeEventListener');

    navigation.destroy();

    expect(docRemoveEventListener).toHaveBeenCalledTimes(2); // Click and keydown handlers
    expect(windowRemoveEventListener).toHaveBeenCalledTimes(2); // Resize handler

    document.body.removeChild(element);
  });

  it('should set active item programmatically', () => {
    const navigation = Navigation({ items: navItems });
    document.body.appendChild(navigation.getElement());

    const element = navigation.getElement();
    const aboutItem = element.querySelector(`.nav__item[data-id="about"]`);

    // Not active initially
    expect(aboutItem.classList.contains('nav__item--active')).toBe(false);

    // Set active programmatically
    navigation.setActiveItem('about');

    // Now it should be active
    expect(aboutItem.classList.contains('nav__item--active')).toBe(true);

    document.body.removeChild(element);
  });

  it('should throw an error when items prop is missing', () => {
    expect(() => Navigation({})).toThrow('Navigation: items is required');
  });

  it('should handle partial updates efficiently', () => {
    const navigation = Navigation({ items: navItems });
    document.body.appendChild(navigation.getElement());

    const element = navigation.getElement();

    // Update className
    navigation.update({ className: 'custom-nav' });
    expect(element.classList.contains('custom-nav')).toBe(true);

    // Update submenuShadow
    navigation.update({ submenuShadow: true });
    expect(element.classList.contains('nav--submenu-shadow')).toBe(true);

    // Update burgerPosition
    navigation.update({ burgerPosition: 'right' });
    expect(element.classList.contains('nav--burger-right')).toBe(true);

    document.body.removeChild(element);
  });
});
