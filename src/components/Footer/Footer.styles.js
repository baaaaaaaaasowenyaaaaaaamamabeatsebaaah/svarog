// src/components/Footer/Footer.styles.js
import { css } from '../../utils/styleInjection.js';

export const footerStyles = css`
  .footer {
    background-color: var(--footer-bg, var(--color-bg-secondary));
    border-top: 1px solid var(--color-border);
    padding: var(--space-8) 0;
    margin-top: auto;
  }

  .footer__container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  .footer__links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    margin-bottom: var(--space-6);
    justify-content: center;
  }

  .footer__link {
    color: var(--footer-text, var(--color-text));
    text-decoration: none;
    font-size: var(--font-size-sm);
  }

  .footer__link:hover {
    color: var(--footer-link-hover, var(--color-primary));
    text-decoration: underline;
  }

  .footer__social {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    margin-bottom: var(--space-6);
    justify-content: center;
  }

  .footer__social-link {
    color: var(--footer-text, var(--color-text));
    text-decoration: none;
    font-size: var(--font-size-sm);
  }

  .footer__social-link:hover {
    color: var(--footer-link-hover, var(--color-primary));
    text-decoration: underline;
  }

  .footer__copyright {
    text-align: center;
  }

  .footer__copyright-text {
    color: var(--footer-text, var(--color-text-light));
    font-size: var(--font-size-sm);
    margin: 0;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .footer {
      padding: var(--space-6) 0;
    }

    .footer__links,
    .footer__social {
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
    }
  }
`;
