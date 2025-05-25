// src/components/Header/Header.styles.js
import { css } from '../../utils/styleInjection.js';

export const headerStyles = css`
  .header {
    background-color: var(--header-bg, var(--color-bg));
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header__container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--space-4) var(--space-4);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header__brand {
    display: flex;
    align-items: center;
  }

  .header__site-name {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    text-decoration: none;
  }

  .header__site-name:hover {
    color: var(--color-primary);
  }

  /* Override navigation styles for header context */
  .header .nav {
    border-bottom: none;
    background: transparent;
    padding: 0;
    margin-right: 0;
  }

  .header .nav-list--depth-0 {
    gap: var(--space-4);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .header__container {
      flex-direction: row; /* Keep horizontal on mobile */
      gap: var(--space-4);
    }

    .header .nav {
      margin-left: auto;
    }
  }
`;
