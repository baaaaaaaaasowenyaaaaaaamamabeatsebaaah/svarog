import { css } from '../../utils/styleInjection.js';

export const imageStyles = css`
  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .image-container--responsive {
    width: 100%;
    height: auto;
    max-width: var(--image-max-width, 100%);
    max-height: var(--image-max-height, auto);
  }

  .image-element {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: all 0.3s ease;
  }

  .image-error {
    font-size: var(--font-size-lg, 18px);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-error, #e53e3e);
  }
`;
