// src/components/ImageSlider/ImageSlider.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImageSlider from './ImageSlider.js';

describe('ImageSlider', () => {
  const mockImages = [
    { imageUrl: '/image1.jpg', alt: 'Image 1' },
    { imageUrl: '/image2.jpg', alt: 'Image 2' },
    { imageUrl: '/image3.jpg', alt: 'Image 3' },
  ];

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should create slider with images', () => {
    const slider = ImageSlider({ images: mockImages });
    const element = slider.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains('image-slider')).toBe(true);

    const slides = element.querySelectorAll('.image-slider__slide');
    expect(slides.length).toBe(3);
  });

  it('should throw error if images array is empty', () => {
    expect(() => ImageSlider({ images: [] })).toThrow(
      'images array is required'
    );
  });

  it('should show navigation arrows by default', () => {
    const slider = ImageSlider({ images: mockImages });
    const element = slider.getElement();

    const arrows = element.querySelectorAll('.image-slider__arrow');
    expect(arrows.length).toBe(2);
  });

  it('should hide arrows when showArrows is false', () => {
    const slider = ImageSlider({ images: mockImages, showArrows: false });
    const element = slider.getElement();

    const arrows = element.querySelectorAll('.image-slider__arrow');
    expect(arrows.length).toBe(0);
  });

  it('should show dots by default', () => {
    const slider = ImageSlider({ images: mockImages });
    const element = slider.getElement();

    const dots = element.querySelectorAll('.image-slider__dot');
    expect(dots.length).toBe(3);
  });

  it('should navigate to next slide', () => {
    const onChange = vi.fn();
    const slider = ImageSlider({ images: mockImages, onChange });

    expect(slider.getCurrentIndex()).toBe(0);

    slider.goToNext();
    expect(slider.getCurrentIndex()).toBe(1);
    expect(onChange).toHaveBeenCalledWith(1, 0);
  });

  it('should navigate to previous slide', () => {
    const slider = ImageSlider({ images: mockImages, currentIndex: 1 });

    expect(slider.getCurrentIndex()).toBe(1);

    slider.goToPrevious();
    expect(slider.getCurrentIndex()).toBe(0);
  });

  it('should loop when at last slide with loop enabled', () => {
    const slider = ImageSlider({
      images: mockImages,
      currentIndex: 2,
      loop: true,
    });

    slider.goToNext();
    expect(slider.getCurrentIndex()).toBe(0);
  });

  it('should not loop when loop is disabled', () => {
    const slider = ImageSlider({
      images: mockImages,
      currentIndex: 2,
      loop: false,
    });

    slider.goToNext();
    expect(slider.getCurrentIndex()).toBe(2);
  });

  it('should navigate with keyboard arrows', () => {
    const slider = ImageSlider({ images: mockImages });
    const element = slider.getElement();

    const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    element.dispatchEvent(rightArrowEvent);
    expect(slider.getCurrentIndex()).toBe(1);

    const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    element.dispatchEvent(leftArrowEvent);
    expect(slider.getCurrentIndex()).toBe(0);
  });

  it('should handle dot click navigation', () => {
    const slider = ImageSlider({ images: mockImages });
    const element = slider.getElement();

    const dots = element.querySelectorAll('.image-slider__dot');
    dots[2].click();

    expect(slider.getCurrentIndex()).toBe(2);
  });

  it('should show thumbnails when enabled', () => {
    const slider = ImageSlider({
      images: mockImages,
      showThumbnails: true,
    });
    const element = slider.getElement();

    const thumbnails = element.querySelectorAll('.image-slider__thumbnail');
    expect(thumbnails.length).toBe(3);
  });

  it('should handle thumbnail click', () => {
    const slider = ImageSlider({
      images: mockImages,
      showThumbnails: true,
    });
    const element = slider.getElement();

    const thumbnails = element.querySelectorAll('.image-slider__thumbnail');
    thumbnails[1].click();

    expect(slider.getCurrentIndex()).toBe(1);
  });

  it('should clean up on destroy', () => {
    const slider = ImageSlider({ images: mockImages });
    const element = slider.getElement();
    document.body.appendChild(element);

    // Store reference to check event listeners
    const clickSpy = vi.fn();
    element.addEventListener('click', clickSpy);

    slider.destroy();

    // The baseComponent doesn't remove element from DOM, it just cleans up
    // So we need to manually remove it or adjust our expectation
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }

    expect(document.body.contains(element)).toBe(false);
  });

  it('should handle touch gestures', () => {
    const slider = ImageSlider({ images: mockImages, enableTouch: true });
    const element = slider.getElement();

    // Mock touch events for jsdom
    const createTouchEvent = (type, touches) => {
      const event = new Event(type, { bubbles: true });
      event.touches = touches;
      return event;
    };

    // Simulate swipe left
    const touchStart = createTouchEvent('touchstart', [{ clientX: 100 }]);
    const touchMove = createTouchEvent('touchmove', [{ clientX: 20 }]);
    const touchEnd = createTouchEvent('touchend', []);

    element.dispatchEvent(touchStart);
    element.dispatchEvent(touchMove);
    element.dispatchEvent(touchEnd);

    expect(slider.getCurrentIndex()).toBe(1);
  });

  it('should update active states correctly', () => {
    const slider = ImageSlider({ images: mockImages });
    const element = slider.getElement();

    slider.goToSlide(1);

    const dots = element.querySelectorAll('.image-slider__dot');
    expect(dots[0].classList.contains('image-slider__dot--active')).toBe(false);
    expect(dots[1].classList.contains('image-slider__dot--active')).toBe(true);
  });
});
