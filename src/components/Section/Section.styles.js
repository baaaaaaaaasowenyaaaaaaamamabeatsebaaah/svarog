// src/components/Section/Section.styles.js
import { css } from '../../utils/styleInjection.js';

export const sectionStyles = css`
  .section {
    display: flex;
    padding: var(--section-padding);
    width: 100%;
    background-color: var(--section-bg);
    color: var(--section-color);
    position: relative;
    z-index: 1;
  }

  .section--minor {
    background-color: var(--section-bg-minor);
    color: var(--section-color-minor);
  }

  .section--no-padding-bottom {
    padding-bottom: 0;
  }

  .section__background-image {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .section__content {
    display: flex;
    flex-direction: column;
    gap: var(--section-gap);
    width: 100%;
    max-width: var(--section-content-max-width);
    margin: 0 auto;
    z-index: 2;
  }

  @media (max-width: 768px) {
    .section {
      padding: var(--section-padding-tablet);
    }
    .section__content {
      gap: var(--section-gap-tablet);
    }
  }

  @media (max-width: 480px) {
    .section {
      padding: var(--section-padding-mobile);
    }
  }
`;
