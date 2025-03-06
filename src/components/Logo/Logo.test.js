import { describe, it, expect } from 'vitest';
import Logo from './Logo';

describe('Logo', () => {
  it('should render the logo with the provided SVG path', () => {
    const svgPath = 'path/to/logo.svg';
    const logo = new Logo({ svgPath });
    const element = logo.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.querySelector('img').src).toContain(svgPath);
  });
});
