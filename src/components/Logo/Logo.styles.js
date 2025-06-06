// src/components/Logo/Logo.styles.js
import { css } from '../../utils/styleInjection.js';

export const logoStyles = css`
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--logo-width, 120px);
    height: var(--logo-height, 40px);
    position: relative;
  }

  .logo-container--responsive {
    width: 100%;
    height: auto;
    max-width: var(--logo-max-width, var(--logo-width, 120px));
    max-height: var(--logo-max-height, var(--logo-height, 40px));
  }

  .logo-image {
    max-width: 100%;
    max-height: 100%;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .logo-container {
      width: var(--logo-width-tablet, var(--logo-width, 100px));
      height: var(--logo-height-tablet, var(--logo-height, 34px));
    }
  }

  @media (max-width: 480px) {
    .logo-container {
      width: var(
        --logo-width-mobile,
        var(--logo-width-tablet, var(--logo-width, 80px))
      );
      height: var(
        --logo-height-mobile,
        var(--logo-height-tablet, var(--logo-height, 28px))
      );
    }
  }
`;
