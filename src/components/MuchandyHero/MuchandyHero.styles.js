// src/components/MuchandyHero/MuchandyHero.styles.js
import { css } from '../../utils/styleInjection.js';

export const muchandyHeroStyles = css`
  /* PERFORMANCE OPTIMIZATION: Efficient CSS with minimal specificity */
  .muchandy-hero {
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: var(--color-bg-dark);
    width: 100%;
    padding: var(--space-8) 0;
    padding-left: 64px;
    padding-right: 64px;
    /* Performance optimizations */
    will-change: background-image;
    backface-visibility: hidden;
    transform: translateZ(0); /* Force hardware acceleration */
  }

  /* Grid layout with optimal performance */
  .muchandy-hero__grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 12px;
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
    line-height: 1.2; /* Better line height for titles with breaks */
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

  /* Form wrapper optimization */
  .muchandy-hero__form-wrapper {
    /* Optimize for potential visibility changes */
    contain: layout style paint;
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
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
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
      background-image: none !important;
      background-color: white !important;
      color: black !important;
      padding: var(--space-4);
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
