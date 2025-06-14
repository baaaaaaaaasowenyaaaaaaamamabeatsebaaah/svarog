// src/components/MuchandyHero/MuchandyHero.styles.js
import { css } from '../../utils/styleInjection.js';

export const muchandyHeroStyles = css`
  /* PERFORMANCE OPTIMIZATION: Efficient CSS with minimal specificity */
  .muchandy-hero {
    position: relative;
    width: 100%;
    padding: var(--space-8) 0;
    padding-left: 64px;
    padding-right: 64px;
    /* Remove direct background styles - will use pseudo-element */
    background-color: var(--color-bg-dark);
    overflow: hidden; /* Contain the blurred edges */
    /* Performance optimizations */
    backface-visibility: hidden;
    transform: translateZ(0); /* Force hardware acceleration */
  }

  /* Blurred background using pseudo-element for performance */
  .muchandy-hero::before {
    content: '';
    position: absolute;
    top: -20px; /* Extend beyond edges to hide blur artifacts */
    left: -20px;
    right: -20px;
    bottom: -20px;
    background-image: var(--muchandy-hero-bg-image, none);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    /* Blur effect with customizable intensity */
    filter: blur(var(--muchandy-hero-blur, 4px));
    /* Performance optimizations */
    will-change: filter, transform;
    transform: translateZ(0) scale(1.1); /* Scale to hide blur edges */
    z-index: -1;
  }

  /* Optional overlay for better text readability */
  .muchandy-hero::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--muchandy-hero-overlay, rgba(0, 0, 0, 0.3));
    z-index: 0;
    pointer-events: none;
  }

  /* Grid layout with optimal performance */
  .muchandy-hero__grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 12px;
    /* Ensure content is above background */
    position: relative;
    z-index: 1;
    /* Performance optimization for grid */
    contain: layout style;
  }

  .muchandy-hero__content-column {
    grid-column: 2 / span 4; /* Start at column 2, span 4 columns */
    min-height: 820px;
    /* Optimization: contain paint operations */
    contain: layout style paint;
  }

  /* Typography with performance optimizations */
  .muchandy-hero__title {
    font-size: var(--font-size-6xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-4);
    color: var(--color-brand-secondary);
    line-height: 1.2;
    /* Text rendering optimizations */
    text-rendering: optimizeLegibility;
    font-display: swap;
    /* Prevent layout shifts */
    contain: layout style;
  }

  .muchandy-hero__subtitle {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-12);
    color: var(--color-white);
    /* Text rendering optimizations */
    text-rendering: optimizeLegibility;
    font-display: swap;
    /* Prevent layout shifts */
    contain: layout style;
  }

  /* Form container with efficient styling */
  .muchandy-hero__form-container {
    background: var(--color-bg-transparent);
    margin: 0;
    border-radius: 0;
    /* Performance optimization */
    contain: layout style;
  }

  /* Blur intensity modifiers */
  .muchandy-hero--blur-light::before {
    filter: blur(4px);
  }

  .muchandy-hero--blur-heavy::before {
    filter: blur(12px);
  }

  .muchandy-hero--blur-extreme::before {
    filter: blur(20px);
  }

  /* No blur modifier */
  .muchandy-hero--no-blur::before {
    filter: none;
    transform: translateZ(0) scale(1); /* Reset scale */
  }

  /* Form wrapper optimization */
  .muchandy-hero__form-wrapper {
    /* Optimize for potential visibility changes */
    contain: layout style paint;
  }

  .muchandy-hero__form-wrapper form {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  /* Tabs component overrides with minimal specificity */
  .muchandy-hero .tabs__panels {
    margin-top: var(--space-5);
  }

  .muchandy-hero__tabs.tabs--border .tabs__button--active {
    color: var(--color-brand-secondary);
    /* Smooth transition for active state */
    transition: color 0.2s ease;
  }

  .muchandy-hero__tabs.tabs--border .tabs__panel--bordered {
    border: 0;
  }

  .muchandy-hero .tabs__button {
    min-width: 120px;
    /* Performance optimization for button interactions */
    contain: layout style;
    /* Smooth transitions */
    transition: all 0.2s ease;
  }

  /* Form styling overrides with efficient selectors */
  .muchandy-hero .phone-repair-form,
  .muchandy-hero .used-phone-price-form {
    box-shadow: none;
    border: none;
    padding: 0;
    background: transparent;
    /* Optimize form rendering */
    contain: layout style;
  }

  /* Price display optimizations */
  .muchandy-hero .price-display .price-display__label,
  .muchandy-hero .price-display--placeholder .price-display__value {
    color: var(--color-white);
    /* Optimize text rendering */
    text-rendering: optimizeLegibility;
  }

  /* Tablet optimizations */
  @media (min-width: 768px) {
    .muchandy-hero .phone-repair-form {
      padding: 0;
    }

    /* Optimize for tablet interactions */
    .muchandy-hero .tabs__button {
      min-width: 140px;
    }
  }

  /* Mobile optimizations with efficient media queries */
  @media (max-width: 768px) {
    .muchandy-hero {
      padding-left: 32px;
      padding-right: 32px;
    }

    /* Reduce blur on mobile for performance */
    .muchandy-hero::before {
      filter: blur(var(--muchandy-hero-blur-mobile, 5px));
    }

    .muchandy-hero__content-column {
      grid-column: 1 / span 12 !important;
      min-height: 600px; /* Reduced height for mobile */
    }

    .muchandy-hero__title {
      font-size: var(--font-size-4xl);
      /* Optimize for mobile scrolling */
      contain: layout style;
    }

    .muchandy-hero__subtitle {
      font-size: var(--font-size-xl);
      margin-bottom: var(--space-8); /* Reduced spacing on mobile */
    }

    /* Mobile-specific form optimizations */
    .muchandy-hero .tabs__button {
      min-width: 100px;
      font-size: var(--font-size-sm, 14px);
    }
  }

  /* Extra small mobile optimizations */
  @media (max-width: 480px) {
    .muchandy-hero {
      padding-left: 16px;
      padding-right: 16px;
      padding-top: var(--space-6);
      padding-bottom: var(--space-6);
    }

    /* Further reduce blur on small devices */
    .muchandy-hero::before {
      filter: blur(3px);
    }

    .muchandy-hero__content-column {
      min-height: 500px;
    }

    .muchandy-hero__title {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--space-3);
    }

    .muchandy-hero__subtitle {
      font-size: var(--font-size-lg);
      margin-bottom: var(--space-6);
    }
  }

  /* Animation optimizations for dynamic updates */
  .muchandy-hero--updating {
    /* Smooth transitions for dynamic updates */
    transition: all 0.3s ease;
  }

  .muchandy-hero--updating .muchandy-hero__title,
  .muchandy-hero--updating .muchandy-hero__subtitle {
    transition: opacity 0.2s ease;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .muchandy-hero__title {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }

    .muchandy-hero__subtitle {
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    }

    /* Increase overlay for better contrast */
    .muchandy-hero::after {
      background: var(--muchandy-hero-overlay, rgba(0, 0, 0, 0.5));
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .muchandy-hero::before {
      /* Disable blur animation but keep static blur */
      filter: blur(var(--muchandy-hero-blur, 8px));
      transition: none !important;
    }

    .muchandy-hero,
    .muchandy-hero *,
    .muchandy-hero *::before,
    .muchandy-hero *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Print optimizations */
  @media print {
    .muchandy-hero {
      background-color: white !important;
      color: black !important;
      padding: var(--space-4);
    }

    /* Remove blur and background in print */
    .muchandy-hero::before,
    .muchandy-hero::after {
      display: none !important;
    }

    .muchandy-hero__title,
    .muchandy-hero__subtitle {
      color: black !important;
      text-shadow: none !important;
    }

    /* Hide interactive elements in print */
    .muchandy-hero .tabs,
    .muchandy-hero .phone-repair-form,
    .muchandy-hero .used-phone-price-form {
      display: none !important;
    }
  }

  /* Performance optimization: GPU acceleration for animations */
  .muchandy-hero__title,
  .muchandy-hero__subtitle,
  .muchandy-hero__form-container {
    /* Enable hardware acceleration for smooth updates */
    will-change: contents;
    transform: translateZ(0);
  }

  /* Container query support for future enhancement */
  @supports (container-type: inline-size) {
    .muchandy-hero {
      container-type: inline-size;
    }

    @container (max-width: 768px) {
      .muchandy-hero__content-column {
        grid-column: 1 / span 12;
      }
    }
  }
`;
