import Navigation from './Navigation.js';
import NavigationItem from './NavigationItem.js';

describe('Navigation component', () => {
  it('should create a navigation element', () => {
    const items = [
      { label: 'Home', href: '#' },
      { label: 'About', href: '#' },
    ];
    const navigation = new Navigation({ items, theme: 'default-theme' });
    const element = navigation.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('should create a nav item element', () => {
    const item = new NavigationItem({ label: 'Home', href: '#' });
    const element = item.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('should toggle burger menu', () => {
    const items = [
      { label: 'Home', href: '#' },
      { label: 'About', href: '#' },
    ];
    const navigation = new Navigation({ items, theme: 'default-theme' });
    document.body.appendChild(navigation.getElement());

    const burger = document.querySelector('.nav-burger');
    expect(burger).not.toBeNull();
    burger.click();

    expect(navigation.getElement().classList.contains('nav--open')).toBe(true);
  });
});
