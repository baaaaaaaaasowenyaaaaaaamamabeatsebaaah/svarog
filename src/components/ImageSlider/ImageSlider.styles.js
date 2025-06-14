// src/components/ImageSlider/ImageSlider.styles.js
import { css } from '../../utils/styleInjection.js';

export const imageSliderStyles = css`
  .image-slider {
    position: relative;
    width: 100%;
    max-width: var(--image-slider-max-width, 100%);
    margin: 0 auto;
  }

  /* Viewport */
  .image-slider__viewport {
    position: relative;
    overflow: hidden;
    background: var(--image-slider-bg, transparent);
    border-radius: var(--image-slider-radius, 0);
  }

  /* Track */
  .image-slider__track {
    display: flex;
    transition: transform var(--image-slider-transition, 0.3s ease);
    will-change: transform;
  }

  /* Slides */
  .image-slider__slide {
    flex: 0 0 100%;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--image-slider-height, 400px);
  }

  .image-slider__image {
    max-height: var(--image-slider-height, 400px);
    width: 100%;
    object-fit: contain;
  }

  /* Navigation Arrows */
  .image-slider__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: var(--image-slider-arrow-bg, rgba(0, 0, 0, 0.4));
    border: 1px solid var(--image-slider-arrow-border, rgba(0, 0, 0, 0.6));
    color: var(--image-slider-arrow-color, white);
    border: none;
    width: var(--image-slider-arrow-size, 40px);
    height: var(--image-slider-arrow-size, 40px);
    border-radius: var(--image-slider-arrow-radius, 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast, 0.2s ease);
    z-index: 2;
    padding: 0;
  }

  .image-slider__arrow:hover:not(:disabled) {
    background: var(--image-slider-arrow-hover-bg, rgba(0, 0, 0, 0.6));
    transform: translateY(-50%) scale(1.1);
  }

  .image-slider__arrow:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .image-slider__arrow svg {
    width: 24px;
    height: 24px;
  }

  .image-slider__arrow--prev {
    left: var(--image-slider-arrow-spacing, 16px);
  }

  .image-slider__arrow--next {
    right: var(--image-slider-arrow-spacing, 16px);
  }

  /* Dots */
  .image-slider__dots {
    display: flex;
    justify-content: center;
    gap: var(--image-slider-dot-gap, 8px);
    padding: var(--image-slider-dot-padding, 16px 0);
  }

  .image-slider__dot {
    width: var(--image-slider-dot-size, 8px);
    height: var(--image-slider-dot-size, 8px);
    border-radius: 50%;
    border: none;
    background: var(--image-slider-dot-bg, rgba(0, 0, 0, 0.4));
    cursor: pointer;
    transition: all var(--transition-fast, 0.2s ease);
    padding: 0;
  }

  .image-slider__dot:hover {
    background: var(--image-slider-dot-hover-bg, rgba(0, 0, 0, 0.6));
  }

  .image-slider__dot--active {
    background: var(
      --image-slider-dot-active-bg,
      var(--color-primary, rgba(0, 0, 0, 0.8))
    );
  }

  /* Thumbnails */
  .image-slider__thumbnails {
    display: flex;
    gap: var(--image-slider-thumbnail-gap, 8px);
    padding: var(--image-slider-thumbnail-padding, 16px 0);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .image-slider__thumbnails::-webkit-scrollbar {
    height: 6px;
  }

  .image-slider__thumbnails::-webkit-scrollbar-track {
    background: var(--color-bg-secondary, transparent);
  }

  .image-slider__thumbnails::-webkit-scrollbar-thumb {
    background: var(--color-text-light, #888);
    border-radius: 3px;
  }

  .image-slider__thumbnail {
    flex: 0 0 auto;
    width: var(--image-slider-thumbnail-size, 80px);
    height: var(--image-slider-thumbnail-size, 80px);
    border: 2px solid transparent;
    border-radius: var(--image-slider-thumbnail-radius, 0);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-fast, 0.2s ease);
    padding: 0;
    background: var(--image-slider-thumbnail-bg, #f5f5f5);
  }

  .image-slider__thumbnail:hover {
    border-color: var(
      --image-slider-thumbnail-hover-border,
      rgba(0, 0, 0, 0.3)
    );
  }

  .image-slider__thumbnail--active {
    border-color: var(
      --image-slider-thumbnail-active-border,
      var(--color-primary, #000)
    );
  }

  .image-slider__thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Focus styles */
  .image-slider:focus {
    outline: 2px solid var(--color-primary, #000);
    outline-offset: 2px;
  }

  .image-slider__arrow:focus,
  .image-slider__dot:focus,
  .image-slider__thumbnail:focus {
    outline: 2px solid var(--color-primary, #000);
    outline-offset: 2px;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .image-slider__slide {
      min-height: var(--image-slider-mobile-height, 300px);
    }

    .image-slider__arrow {
      width: var(--image-slider-arrow-mobile-size, 36px);
      height: var(--image-slider-arrow-mobile-size, 36px);
    }

    .image-slider__arrow--prev {
      left: var(--image-slider-arrow-mobile-spacing, 8px);
    }

    .image-slider__arrow--next {
      right: var(--image-slider-arrow-mobile-spacing, 8px);
    }

    .image-slider__thumbnail {
      width: var(--image-slider-thumbnail-mobile-size, 60px);
      height: var(--image-slider-thumbnail-mobile-size, 60px);
    }
  }

  /* Touch device optimizations */
  @media (hover: none) {
    .image-slider__arrow {
      opacity: 0.8;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .image-slider__track {
      transition: none;
    }
  }
`;
