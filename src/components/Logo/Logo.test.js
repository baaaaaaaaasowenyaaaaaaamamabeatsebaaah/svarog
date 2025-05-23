// src/components/Logo/Logo.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Logo from './index.js';

describe('Logo component', () => {
  const mockSvgPath = 'path/to/logo.svg';
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should render with imageUrl', () => {
    const logo = Logo({ imageUrl: mockSvgPath });
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

  it('should support legacy src prop with warning', () => {
    const logo = Logo({ src: mockSvgPath });
    const element = logo.getElement();

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Logo] src is deprecated, use imageUrl instead'
    );

    const imgContainer = element.querySelector('.image-container');
    expect(imgContainer).not.toBeNull();

    const img = imgContainer.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.src).toContain(mockSvgPath);
  });

  it('should support legacy fallbackSrc prop with warning', () => {
    const fallbackPath = 'path/to/fallback.svg';
    const logo = Logo({
      imageUrl: mockSvgPath,
      fallbackSrc: fallbackPath,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Logo] fallbackSrc is deprecated, use fallbackImageUrl instead'
    );

    // We'll validate the component renders correctly
    const element = logo.getElement();
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('should apply responsive class when responsive is true', () => {
    const logo = Logo({
      imageUrl: mockSvgPath,
      responsive: true,
    });

    const element = logo.getElement();
    expect(element.classList.contains('logo-container--responsive')).toBe(true);
  });

  it('should not apply responsive class when responsive is false', () => {
    const logo = Logo({
      imageUrl: mockSvgPath,
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
      imageUrl: mockSvgPath,
      className: customClass,
    });

    const element = logo.getElement();
    expect(element.classList.contains(customClass)).toBe(true);
  });

  it('should throw error when imageUrl is not provided', () => {
    expect(() => {
      Logo({});
    }).toThrow('Logo: imageUrl is required');
  });

  it('should normalize legacy props in update method', () => {
    const logo = Logo({ imageUrl: mockSvgPath });
    const newPath = 'new/path.svg';

    // Use legacy src prop in update
    logo.update({ src: newPath });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Logo] src is deprecated, use imageUrl instead'
    );

    // Get the updated element
    const updatedElement = logo.getElement();

    // Find the img element
    const img = updatedElement.querySelector('img');
    expect(img.src).toContain(newPath);
  });

  it('should support legacy setSrc method with warning', () => {
    const logo = Logo({ imageUrl: mockSvgPath });
    const newPath = 'new/path.svg';

    // Mock the update method to verify it's called with the right props
    const updateSpy = vi.spyOn(logo, 'update');

    logo.setSrc(newPath);

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Logo] setSrc is deprecated, use setImageUrl instead'
    );
    expect(updateSpy).toHaveBeenCalledWith({ imageUrl: newPath });

    updateSpy.mockRestore();
  });

  it('should support setImageUrl method', () => {
    const logo = Logo({ imageUrl: mockSvgPath });
    const newPath = 'new/path.svg';

    // Mock the update method to verify it's called with the right props
    const updateSpy = vi.spyOn(logo, 'update');

    logo.setImageUrl(newPath);

    expect(updateSpy).toHaveBeenCalledWith({ imageUrl: newPath });

    updateSpy.mockRestore();
  });

  it('should clean up resources on destroy', () => {
    const logo = Logo({ imageUrl: mockSvgPath });
    expect(() => {
      logo.destroy();
    }).not.toThrow();
  });
});
