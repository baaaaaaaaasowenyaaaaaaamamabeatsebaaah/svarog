// src/components/ContactInfo/ContactInfo.styles.js
import { css } from '../../utils/styleInjection.js';

export const contactInfoStyles = css`
  .contact-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--contact-info-gap, var(--space-4));
  }

  .contact-info__item {
    display: flex;
    align-items: center;
    gap: var(--contact-info-item-gap, var(--space-2));
    font-size: var(--contact-info-font-size, var(--font-size-sm));
    color: var(--contact-info-color, var(--color-text));
    text-decoration: none;
    transition: color var(--transition-duration) var(--transition-timing);
  }

  .contact-info__item--phone,
  .contact-info__item--email,
  .contact-info__item--location {
    cursor: pointer;
  }

  .contact-info__item--phone:hover,
  .contact-info__item--email:hover,
  .contact-info__item--location:hover {
    color: var(--contact-info-hover-color, var(--color-brand-primary));
  }

  .contact-info__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--contact-info-icon-size, 18px);
    height: var(--contact-info-icon-size, 18px);
  }

  /* SVG icons using mask-image for better theme support */
  .contact-info__icon--location {
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
    background-color: currentColor;
  }

  .contact-info__icon--phone {
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
    background-color: currentColor;
  }

  .contact-info__icon--email {
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-position: center;
    background-color: currentColor;
  }

  @media (max-width: 768px) {
    .contact-info {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--contact-info-mobile-gap, var(--space-2));
    }
  }
`;
