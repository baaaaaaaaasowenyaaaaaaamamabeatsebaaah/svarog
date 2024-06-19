import Link from './Link';

describe('Link component', () => {
  it('should create a link element', () => {
    const link = new Link({
      children: 'Click me',
      href: '#',
      color: 'blue',
      hoverColor: 'red',
      size: '1rem',
      target: '_blank',
      weight: 'bold',
      underline: true,
      block: false,
    });
    const element = link.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toBe('link');
  });

  it('should apply correct styles', () => {
    const link = new Link({
      children: 'Styled link',
      href: '#',
      color: 'green',
      hoverColor: 'darkgreen',
      size: '1.2rem',
      target: '_self',
      weight: 'normal',
      underline: false,
      block: true,
    });
    const element = link.getElement();
    expect(element.style.color).toBe('green');
    expect(element.style.fontSize).toBe('1.2rem');
    expect(element.style.fontWeight).toBe('normal');
    expect(element.style.textDecoration).toBe('none');
    expect(element.style.display).toBe('block');
  });

  it('should have correct href attribute', () => {
    const link = new Link({
      children: 'Link with href',
      href: 'https://example.com',
    });
    const element = link.getElement();
    expect(element.href).toBe('https://example.com/');
  });
});
