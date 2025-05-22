// src/components/Logo/Logo.test.js
import { describe, it, expect } from 'vitest';
import Logo from './index.js';

describe('Logo component', () => {
  const mockSvgPath = 'path/to/logo.svg';

  it('should render with src', () => {
    const logo = Logo({ src: mockSvgPath });
    const element = logo.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('logo-container')).toBe(true);

    const imgContainer = element.querySelector('.image-container');
    expect(imgContainer).not.toBeNull();

    const img = imgContainer.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.src).toContain(mockSvgPath);
    expect(img.alt).toBe('Logo');
  });

  it('should apply responsive class when responsive is true', () => {
    const logo = Logo({
      src: mockSvgPath,
      responsive: true,
    });

    const element = logo.getElement();
    expect(element.classList.contains('logo-container--responsive')).toBe(true);
  });

  it('should not apply responsive class when responsive is false', () => {
    const logo = Logo({
      src: mockSvgPath,
      responsive: false,
    });

    const element = logo.getElement();
    expect(element.classList.contains('logo-container--responsive')).toBe(
      false
    );
  });

  it('should apply custom class name', () => {
    const customClass = 'custom-logo';
    const logo = Logo({
      src: mockSvgPath,
      className: customClass,
    });

    const element = logo.getElement();
    expect(element.classList.contains(customClass)).toBe(true);
  });

  it('should throw error when src is not provided', () => {
    expect(() => {
      Logo({});
    }).toThrow('Logo: src is required');
  });

  it('should clean up resources on destroy', () => {
    const logo = Logo({ src: mockSvgPath });
    expect(() => {
      logo.destroy();
    }).not.toThrow();
  });
});
