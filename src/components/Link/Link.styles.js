// src/components/Link/Link.styles.js
import { css } from '../../utils/styleInjection.js';

export const linkStyles = css`
  .link {
    align-items: baseline;
    margin-left: var(--link-margin-left);
    margin-right: var(--link-margin-right);
    color: var(--link-color);
    flex-shrink: 0;
    transition: var(--link-transition);
    cursor: pointer;
  }

  .link:hover {
    color: var(--link-hover-color);
  }
`;
