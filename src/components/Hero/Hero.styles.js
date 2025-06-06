// src/components/Hero/Hero.styles.js
import { css } from '../../utils/styleInjection.js';

export const heroStyles = css`
  .hero {
    position: relative;
    padding: var(--space-12) var(--space-4);
    background-color: var(--color-bg-secondary);
    overflow: hidden;
  }

  .hero--with-background {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: var(--color-text-white);
  }

  .hero--with-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .hero__content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero--left .hero__content {
    margin-left: 0;
    text-align: left;
  }

  .hero--center .hero__content {
    text-align: center;
  }

  .hero--right .hero__content {
    margin-right: 0;
    text-align: right;
    margin-left: auto;
  }

  .hero__title {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--space-4);
    line-height: 1.2;
  }

  .hero__subtitle {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-8);
    opacity: 0.9;
  }

  .hero__cta {
    margin-top: var(--space-4);
  }

  .hero--with-background .hero__title,
  .hero--with-background .hero__subtitle {
    color: var(--color-text-white);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .hero {
      padding: var(--space-8) var(--space-4);
    }

    .hero__title {
      font-size: var(--font-size-3xl);
    }

    .hero__subtitle {
      font-size: var(--font-size-lg);
    }
  }
`;
