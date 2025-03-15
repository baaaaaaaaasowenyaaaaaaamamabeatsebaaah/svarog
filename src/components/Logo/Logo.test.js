// src/components/Logo/Logo.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Logo from './Logo.js';
import * as themeUtils from '../../utils/theme.js';

// Mock theme utils
vi.mock('../../utils/theme.js', () => ({
  getCurrentTheme: vi.fn().mockReturnValue('default'),
  themeManager: {
    getCurrentTheme: vi.fn().mockReturnValue('default'),
  },
}));

describe('Logo component', () => {
  const mockSvgPath = 'path/to/logo.svg';
  const mockCabalouPath = 'path/to/cabalou-logo.svg';

  // Setup and teardown
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any listeners
    vi.restoreAllMocks();
  });

  it('should render with a string source', () => {
    const logo = new Logo({ sources: mockSvgPath });
    const element = logo.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('logo-container')).toBe(true);

    const img = element.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.src).toContain(mockSvgPath);
    expect(img.alt).toBe('Logo');
  });

  it('should render with theme-specific sources', () => {
    // Mock getCurrentTheme to return 'default'
    themeUtils.getCurrentTheme.mockReturnValue('default');

    const logo = new Logo({
      sources: {
        default: mockSvgPath,
        cabalou: mockCabalouPath,
      },
    });

    const element = logo.getElement();
    const img = element.querySelector('img');

    expect(img.src).toContain(mockSvgPath);

    // Change theme and trigger theme change event
    themeUtils.getCurrentTheme.mockReturnValue('cabalou');
    logo.handleThemeChange();

    // Now it should show the cabalou logo
    const updatedImg = element.querySelector('img');
    expect(updatedImg.src).toContain(mockCabalouPath);
  });

  it('should use fallback path if theme-specific logo not found', () => {
    // Mock getCurrentTheme to return 'muchandy' which isn't in our sources
    themeUtils.getCurrentTheme.mockReturnValue('muchandy');

    const logo = new Logo({
      sources: {
        default: mockSvgPath,
        cabalou: mockCabalouPath,
      },
      fallbackPath: 'fallback.svg',
    });

    const element = logo.getElement();
    const img = element.querySelector('img');

    // Should use fallback path
    expect(img.src).toContain('fallback.svg');
  });

  it('should use first available logo if no match and no fallback', () => {
    // Mock getCurrentTheme to return 'muchandy' which isn't in our sources
    themeUtils.getCurrentTheme.mockReturnValue('muchandy');

    const logo = new Logo({
      sources: {
        default: mockSvgPath,
        cabalou: mockCabalouPath,
      },
    });

    const element = logo.getElement();
    const img = element.querySelector('img');

    // Should use the first available logo (default)
    expect(img.src).toContain(mockSvgPath);
  });

  it('should apply responsive class when responsive is true', () => {
    const logo = new Logo({
      sources: mockSvgPath,
      responsive: true,
    });

    const element = logo.getElement();
    expect(element.classList.contains('logo-container--responsive')).toBe(true);
  });

  it('should not apply responsive class when responsive is false', () => {
    const logo = new Logo({
      sources: mockSvgPath,
      responsive: false,
    });

    const element = logo.getElement();
    expect(element.classList.contains('logo-container--responsive')).toBe(
      false
    );
  });

  it('should apply custom class name', () => {
    const customClass = 'custom-logo';
    const logo = new Logo({
      sources: mockSvgPath,
      className: customClass,
    });

    const element = logo.getElement();
    expect(element.classList.contains(customClass)).toBe(true);
  });

  it('should attach click handler when provided', () => {
    const handleClick = vi.fn();
    const logo = new Logo({
      sources: mockSvgPath,
      onClick: handleClick,
    });

    const element = logo.getElement();
    element.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should throw error when sources is not provided', () => {
    expect(() => {
      new Logo({});
    }).toThrow('Logo: sources is required');
  });

  it('should clean up event listeners on destroy', () => {
    const logo = new Logo({ sources: mockSvgPath });
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    logo.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'themechange',
      expect.any(Function)
    );
  });

  it('should create error span when image fails to load', () => {
    const logo = new Logo({ sources: 'invalid.svg' });
    const element = logo.getElement();
    const img = element.querySelector('img');

    // Simulate image load error
    img.dispatchEvent(new Event('error'));

    // After error, should show error span
    const errorSpan = element.querySelector('.logo-error');
    expect(errorSpan).not.toBeNull();
    expect(errorSpan.textContent).toBe('Logo');
  });
});
