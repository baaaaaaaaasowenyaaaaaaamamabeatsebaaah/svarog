// src/components/Image/Image.test.js
import { describe, it, expect, vi } from 'vitest';
import Image from './index.js';

describe('Image component', () => {
  const mockImagePath = 'https://picsum.photos/300/200';
  const mockFallbackPath = 'https://picsum.photos/300/200?grayscale';

  it('should render with imageUrl', () => {
    const image = Image({ imageUrl: mockImagePath });
    const element = image.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('image-container')).toBe(true);

    const img = element.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.src).toContain(mockImagePath);
    expect(img.alt).toBe('Image');
  });

  it('should support legacy src prop', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const image = Image({ src: mockImagePath });
    const element = image.getElement();

    const img = element.querySelector('img');
    expect(img.src).toContain(mockImagePath);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Image] src is deprecated, use imageUrl instead'
    );

    consoleSpy.mockRestore();
  });

  it('should apply responsive class when responsive is true', () => {
    const image = Image({
      imageUrl: mockImagePath,
      responsive: true,
    });

    const element = image.getElement();
    expect(element.classList.contains('image-container--responsive')).toBe(
      true
    );
  });

  it('should not apply responsive class when responsive is false', () => {
    const image = Image({
      imageUrl: mockImagePath,
      responsive: false,
    });

    const element = image.getElement();
    expect(element.classList.contains('image-container--responsive')).toBe(
      false
    );
  });

  it('should apply custom class name', () => {
    const customClass = 'custom-image';
    const image = Image({
      imageUrl: mockImagePath,
      className: customClass,
    });

    const element = image.getElement();
    expect(element.classList.contains(customClass)).toBe(true);
  });

  it('should attach click handler when provided', () => {
    const handleClick = vi.fn();
    const image = Image({
      imageUrl: mockImagePath,
      onClick: handleClick,
    });

    const element = image.getElement();
    element.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should throw error when imageUrl is not provided', () => {
    expect(() => {
      Image({});
    }).toThrow('Image: imageUrl is required');
  });

  it('should handle image load errors and use fallback', () => {
    const image = Image({
      imageUrl: 'invalid.jpg',
      fallbackImageUrl: mockFallbackPath,
    });

    const element = image.getElement();
    const img = element.querySelector('img');

    // Simulate image load error
    img.onerror();

    expect(img.src).toContain(mockFallbackPath);
  });

  it('should support legacy fallbackSrc prop', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const image = Image({
      imageUrl: 'invalid.jpg',
      fallbackSrc: mockFallbackPath,
    });

    const element = image.getElement();
    const img = element.querySelector('img');

    // Simulate image load error
    img.onerror();

    expect(img.src).toContain(mockFallbackPath);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Image] fallbackSrc is deprecated, use fallbackImageUrl instead'
    );

    consoleSpy.mockRestore();
  });

  it('should handle fallback failure correctly', () => {
    const image = Image({
      imageUrl: 'invalid.jpg',
      fallbackImageUrl: 'also-invalid.jpg',
      alt: 'Test Image',
    });

    const element = image.getElement();
    const img = element.querySelector('img');

    // Simulate first error
    img.onerror();

    // Get the new error handler assigned during the first error
    const fallbackErrorHandler = img.onerror;

    // Simulate fallback error
    fallbackErrorHandler();

    const errorSpan = element.querySelector('.image-error');
    expect(errorSpan).not.toBeNull();
    expect(errorSpan.textContent).toBe('Test Image');
  });

  it('should show error text when image fails with no fallback', () => {
    const image = Image({
      imageUrl: 'invalid.jpg',
      alt: 'Test Image',
    });

    const element = image.getElement();
    const img = element.querySelector('img');

    // Simulate image load error
    img.onerror();

    const errorSpan = element.querySelector('.image-error');
    expect(errorSpan).not.toBeNull();
    expect(errorSpan.textContent).toBe('Test Image');
  });

  it('should update image source through setImageUrl method', () => {
    const image = Image({ imageUrl: mockImagePath });
    const newSrc = 'https://picsum.photos/400/300';

    image.setImageUrl(newSrc);

    const element = image.getElement();
    const img = element.querySelector('img');
    expect(img.src).toContain(newSrc);
  });

  it('should update image source through legacy setSrc method', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const image = Image({ imageUrl: mockImagePath });
    const newSrc = 'https://picsum.photos/400/300';

    image.setSrc(newSrc);

    const element = image.getElement();
    const img = element.querySelector('img');
    expect(img.src).toContain(newSrc);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Image: setSrc is deprecated, use setImageUrl instead'
    );

    consoleSpy.mockRestore();
  });

  it('should update alt text through setAlt method', () => {
    const image = Image({ imageUrl: mockImagePath });
    const newAlt = 'Updated alt text';

    image.setAlt(newAlt);

    const element = image.getElement();
    const img = element.querySelector('img');
    expect(img.alt).toBe(newAlt);
  });
});
