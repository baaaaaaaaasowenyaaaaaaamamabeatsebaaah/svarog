import { Navigation, NavItem } from './Navigation';

describe('Navigation component', () => {
  it('should create a navigation element', () => {
    const items = [
      { label: 'Home', href: '#' },
      { label: 'About', href: '#' },
    ];
    const navigation = new Navigation({ items, theme: 'default-theme' });
    const element = navigation.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelectorAll('li')).toHaveLength(2);
  });

  it('should create a nav item element', () => {
    const item = new NavItem({ label: 'Home', href: '#' });
    const element = item.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('a').textContent).toBe('Home');
  });

  it('should toggle burger menu', () => {
    const items = [
      { label: 'Home', href: '#' },
      { label: 'About', href: '#' },
    ];
    const navigation = new Navigation({ items, theme: 'default-theme' });
    document.body.appendChild(navigation.getElement());

    const burgerButton = document.querySelector('.burger-button');
    burgerButton.click();
    expect(
      document.querySelector('.navigation-list').classList.contains('active')
    ).toBe(true);

    burgerButton.click();
    expect(
      document.querySelector('.navigation-list').classList.contains('active')
    ).toBe(false);
  });
});
