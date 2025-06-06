// src/components/StickyContactIcons/StickyContactIcons.styles.js
import { css } from '../../utils/styleInjection.js';

export const stickyContactIconsStyles = css`
  .sticky-contact-icons {
    position: fixed;
    right: var(--sticky-contact-icons-right, var(--space-4));
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: var(--sticky-contact-icons-gap, var(--space-3));
    z-index: var(--z-index-sticky);
    padding: var(--sticky-contact-icons-padding, var(--space-3));
    background-color: var(--sticky-contact-icons-bg, var(--color-bg));
    border-radius: 0;
    box-shadow: var(--sticky-contact-icons-shadow, var(--shadow-md));
  }

  .sticky-contact-icons__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--sticky-contact-icons-size, 40px);
    height: var(--sticky-contact-icons-size, 40px);
    color: var(--sticky-contact-icons-color, var(--color-text));
    cursor: pointer;
    transition:
      transform 0.2s ease,
      color 0.2s ease;
  }

  .sticky-contact-icons__item:hover {
    transform: scale(1.15);
    color: var(--sticky-contact-icons-hover-color, var(--color-primary));
  }

  .sticky-contact-icons__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--sticky-contact-icons-icon-size, 20px);
    height: var(--sticky-contact-icons-icon-size, 20px);
  }

  /* Reuse the same SVG mask patterns from ContactInfo component */
  .sticky-contact-icons__icon--location {
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
    background-color: currentColor;
  }

  .sticky-contact-icons__icon--phone {
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
    background-color: currentColor;
  }

  .sticky-contact-icons__icon--email {
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
    background-color: currentColor;
  }

  @media (max-width: 768px) {
    .sticky-contact-icons {
      position: fixed;
      right: var(--sticky-contact-icons-mobile-right, var(--space-2));
      bottom: var(--sticky-contact-icons-mobile-bottom, var(--space-4));
      top: auto;
      transform: none;
      flex-direction: row;
    }

    .sticky-contact-icons__item {
      width: var(--sticky-contact-icons-mobile-size, 36px);
      height: var(--sticky-contact-icons-mobile-size, 36px);
    }

    .sticky-contact-icons__icon {
      width: var(--sticky-contact-icons-mobile-icon-size, 18px);
      height: var(--sticky-contact-icons-mobile-icon-size, 18px);
    }
  }
`;
