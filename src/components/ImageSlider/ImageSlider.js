// src/components/ImageSlider/ImageSlider.js
import { createElement } from '../../utils/componentFactory.js';
import { createBaseComponent } from '../../utils/baseComponent.js';
import { createStyleInjector } from '../../utils/styleInjection.js';
import { imageSliderStyles } from './ImageSlider.styles.js';
import Image from '../Image/index.js';

// Create style injector for ImageSlider component
const injectImageSliderStyles = createStyleInjector('ImageSlider');

/**
 * Creates an ImageSlider component for displaying multiple images with navigation
 * @param {Object} props - ImageSlider properties
 * @param {Array<Object>} props.images - Array of image objects with imageUrl and alt
 * @param {number} [props.currentIndex=0] - Initial image index
 * @param {boolean} [props.showArrows=true] - Show navigation arrows
 * @param {boolean} [props.showDots=true] - Show dot indicators
 * @param {boolean} [props.showThumbnails=false] - Show thumbnail navigation
 * @param {boolean} [props.enableKeyboard=true] - Enable keyboard navigation
 * @param {boolean} [props.enableTouch=true] - Enable touch/swipe navigation
 * @param {boolean} [props.loop=true] - Enable infinite loop
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onChange] - Callback when image changes
 * @returns {Object} ImageSlider component API
 */
const ImageSlider = (props = {}) => {
  // Inject styles on component creation
  injectImageSliderStyles(imageSliderStyles);

  // Validate props
  if (
    !props.images ||
    !Array.isArray(props.images) ||
    props.images.length === 0
  ) {
    throw new Error(
      'ImageSlider: images array is required and must not be empty'
    );
  }

  // Component state (managed separately from baseComponent)
  const componentState = {
    images: props.images,
    showArrows: props.showArrows !== false,
    showDots: props.showDots !== false,
    showThumbnails: props.showThumbnails || false,
    enableKeyboard: props.enableKeyboard !== false,
    enableTouch: props.enableTouch !== false,
    loop: props.loop !== false,
    className: props.className || '',
    onChange: props.onChange || null,
  };

  // Internal state
  let currentIndex = props.currentIndex || 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let currentElement = null;

  // Component instances
  const imageComponents = [];

  // Navigation functions
  const goToSlide = (index) => {
    const previousIndex = currentIndex;
    const maxIndex = componentState.images.length - 1;

    if (componentState.loop) {
      currentIndex =
        ((index % componentState.images.length) +
          componentState.images.length) %
        componentState.images.length;
    } else {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
    }

    if (currentIndex !== previousIndex) {
      updateSlider();

      if (componentState.onChange) {
        componentState.onChange(currentIndex, previousIndex);
      }
    }
  };

  const goToPrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  const updateSlider = () => {
    if (!currentElement) return;

    // Update track position
    const track = currentElement.querySelector('.image-slider__track');
    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Update slides aria-hidden
    const slides = currentElement.querySelectorAll('.image-slider__slide');
    slides.forEach((slide, index) => {
      slide.setAttribute(
        'aria-hidden',
        index !== currentIndex ? 'true' : 'false'
      );
    });

    // Update arrow states
    if (!componentState.loop) {
      const prevButton = currentElement.querySelector(
        '.image-slider__arrow--prev'
      );
      const nextButton = currentElement.querySelector(
        '.image-slider__arrow--next'
      );

      if (prevButton) {
        prevButton.disabled = currentIndex === 0;
      }
      if (nextButton) {
        nextButton.disabled = currentIndex === componentState.images.length - 1;
      }
    }

    // Update dots
    const dots = currentElement.querySelectorAll('.image-slider__dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('image-slider__dot--active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('image-slider__dot--active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    // Update thumbnails
    const thumbnails = currentElement.querySelectorAll(
      '.image-slider__thumbnail'
    );
    thumbnails.forEach((thumb, index) => {
      if (index === currentIndex) {
        thumb.classList.add('image-slider__thumbnail--active');
      } else {
        thumb.classList.remove('image-slider__thumbnail--active');
      }
    });
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (!componentState.enableTouch) return;
    touchStartX = e.touches[0].clientX;
    isDragging = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !componentState.enableTouch) return;
    touchEndX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging || !componentState.enableTouch) return;

    isDragging = false;
    const diff = touchStartX - touchEndX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  // Keyboard handler
  const handleKeyDown = (e) => {
    if (!componentState.enableKeyboard) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
    }
  };

  // Event delegation for clicks
  const handleClick = (e) => {
    // Check for dot or thumbnail click
    const indexElement = e.target.closest('[data-index]');
    if (indexElement) {
      const index = parseInt(indexElement.getAttribute('data-index'), 10);
      goToSlide(index);
      return;
    }

    // Check for arrow clicks
    if (e.target.closest('.image-slider__arrow--prev')) {
      goToPrevious();
    } else if (e.target.closest('.image-slider__arrow--next')) {
      goToNext();
    }
  };

  // Render function
  const renderImageSlider = (_state) => {
    // Clean up old image components
    imageComponents.forEach((img) => img?.destroy());
    imageComponents.length = 0;

    // Create main container
    const container = createElement('div', {
      classes: ['image-slider', componentState.className].filter(Boolean),
      attributes: {
        'aria-label': 'Image slider',
        'aria-roledescription': 'carousel',
      },
    });

    // Create viewport
    const viewport = createElement('div', {
      classes: ['image-slider__viewport'],
    });

    // Create track
    const track = createElement('div', {
      classes: ['image-slider__track'],
      styles: {
        transform: `translateX(-${currentIndex * 100}%)`,
      },
    });

    // Create slides
    componentState.images.forEach((imageData, index) => {
      const slide = createElement('div', {
        classes: ['image-slider__slide'],
        attributes: {
          'aria-label': `Slide ${index + 1} of ${componentState.images.length}`,
          'aria-hidden': index !== currentIndex ? 'true' : 'false',
        },
      });

      // Create Image component
      const imageComponent = Image({
        imageUrl: imageData.imageUrl,
        alt: imageData.alt || `Image ${index + 1}`,
        fallbackImageUrl: imageData.fallbackImageUrl,
        responsive: true,
        className: 'image-slider__image',
      });

      imageComponents[index] = imageComponent;
      slide.appendChild(imageComponent.getElement());
      track.appendChild(slide);
    });

    viewport.appendChild(track);
    container.appendChild(viewport);

    // Add navigation arrows if enabled
    if (componentState.showArrows && componentState.images.length > 1) {
      const prevButton = createElement('button', {
        classes: ['image-slider__arrow', 'image-slider__arrow--prev'],
        attributes: {
          type: 'button',
          'aria-label': 'Previous image',
          disabled: !componentState.loop && currentIndex === 0 ? '' : null,
        },
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
      });

      const nextButton = createElement('button', {
        classes: ['image-slider__arrow', 'image-slider__arrow--next'],
        attributes: {
          type: 'button',
          'aria-label': 'Next image',
          disabled:
            !componentState.loop &&
            currentIndex === componentState.images.length - 1
              ? ''
              : null,
        },
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>',
      });

      container.appendChild(prevButton);
      container.appendChild(nextButton);
    }

    // Add dot indicators if enabled
    if (componentState.showDots && componentState.images.length > 1) {
      const dots = createElement('div', {
        classes: ['image-slider__dots'],
        attributes: {
          role: 'tablist',
          'aria-label': 'Image selection',
        },
      });

      componentState.images.forEach((_, index) => {
        const dot = createElement('button', {
          classes: [
            'image-slider__dot',
            index === currentIndex ? 'image-slider__dot--active' : '',
          ].filter(Boolean),
          attributes: {
            type: 'button',
            role: 'tab',
            'aria-label': `Go to image ${index + 1}`,
            'aria-selected': index === currentIndex ? 'true' : 'false',
            'data-index': index.toString(),
          },
        });
        dots.appendChild(dot);
      });

      container.appendChild(dots);
    }

    // Add thumbnails if enabled
    if (componentState.showThumbnails && componentState.images.length > 1) {
      const thumbnails = createElement('div', {
        classes: ['image-slider__thumbnails'],
      });

      componentState.images.forEach((imageData, index) => {
        const thumbnail = createElement('button', {
          classes: [
            'image-slider__thumbnail',
            index === currentIndex ? 'image-slider__thumbnail--active' : '',
          ].filter(Boolean),
          attributes: {
            type: 'button',
            'aria-label': `View image ${index + 1}`,
            'data-index': index.toString(),
          },
        });

        const thumbImage = Image({
          imageUrl: imageData.thumbnailUrl || imageData.imageUrl,
          alt: `Thumbnail ${index + 1}`,
          className: 'image-slider__thumbnail-image',
        });

        thumbnail.appendChild(thumbImage.getElement());
        thumbnails.appendChild(thumbnail);
      });

      container.appendChild(thumbnails);
    }

    // Store current element
    currentElement = container;

    // Attach event listeners
    container.addEventListener('click', handleClick);

    if (componentState.enableTouch) {
      container.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      container.addEventListener('touchmove', handleTouchMove, {
        passive: true,
      });
      container.addEventListener('touchend', handleTouchEnd);
    }

    if (componentState.enableKeyboard) {
      container.setAttribute('tabindex', '0');
      container.addEventListener('keydown', handleKeyDown);
    }

    return container;
  };

  // Create base component
  const baseComponent = createBaseComponent(renderImageSlider)(componentState);

  // Override update to handle state updates
  const originalUpdate = baseComponent.update;
  baseComponent.update = function (newProps) {
    // Update component state
    Object.assign(componentState, newProps);

    // Call original update
    return originalUpdate.call(this, newProps);
  };

  // Override destroy to clean up
  const originalDestroy = baseComponent.destroy;
  baseComponent.destroy = function () {
    // Destroy image components
    imageComponents.forEach((img) => img?.destroy());
    imageComponents.length = 0;

    // Clean up event listeners
    if (currentElement) {
      currentElement.removeEventListener('click', handleClick);
      currentElement.removeEventListener('touchstart', handleTouchStart);
      currentElement.removeEventListener('touchmove', handleTouchMove);
      currentElement.removeEventListener('touchend', handleTouchEnd);
      currentElement.removeEventListener('keydown', handleKeyDown);
      currentElement = null;
    }

    return originalDestroy.call(this);
  };

  // Public API
  return {
    ...baseComponent,

    /**
     * Go to specific slide
     * @param {number} index - Slide index
     */
    goToSlide,

    /**
     * Go to previous slide
     */
    goToPrevious,

    /**
     * Go to next slide
     */
    goToNext,

    /**
     * Get current slide index
     * @returns {number} Current index
     */
    getCurrentIndex: () => currentIndex,

    /**
     * Get total number of slides
     * @returns {number} Total slides
     */
    getTotalSlides: () => componentState.images.length,
  };
};

export default ImageSlider;
