// src/components/Grid/Grid.styles.js
import { css } from '../../utils/styleInjection.js';

export const gridStyles = css`
  /**
   * Grid component styles
   */

  /* Base Grid Styles */
  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    width: 100%;
    box-sizing: border-box;
  }

  /* Direction modifiers */
  .grid--reverse {
    direction: rtl;
  }

  .grid--mobile-reverse {
    direction: ltr;
  }

  @media (max-width: 767px) {
    .grid--mobile-reverse {
      direction: rtl;
    }
  }

  /* Column Styles */
  .column {
    box-sizing: border-box;
    direction: ltr; /* Ensure content is always ltr even in rtl grids */
  }

  /* Responsive column classes */
  /* Mobile (under 768px) */
  @media (max-width: 767px) {
    .column--mobile-1 {
      grid-column-end: span 1;
    }
    .column--mobile-2 {
      grid-column-end: span 2;
    }
    .column--mobile-3 {
      grid-column-end: span 3;
    }
    .column--mobile-4 {
      grid-column-end: span 4;
    }
    .column--mobile-5 {
      grid-column-end: span 5;
    }
    .column--mobile-6 {
      grid-column-end: span 6;
    }
    .column--mobile-7 {
      grid-column-end: span 7;
    }
    .column--mobile-8 {
      grid-column-end: span 8;
    }
    .column--mobile-9 {
      grid-column-end: span 9;
    }
    .column--mobile-10 {
      grid-column-end: span 10;
    }
    .column--mobile-11 {
      grid-column-end: span 11;
    }
    .column--mobile-12 {
      grid-column-end: span 12;
    }
  }

  /* Tablet (768px - 1023px) */
  @media (min-width: 768px) and (max-width: 1023px) {
    .column--tablet-1 {
      grid-column-end: span 1;
    }
    .column--tablet-2 {
      grid-column-end: span 2;
    }
    .column--tablet-3 {
      grid-column-end: span 3;
    }
    .column--tablet-4 {
      grid-column-end: span 4;
    }
    .column--tablet-5 {
      grid-column-end: span 5;
    }
    .column--tablet-6 {
      grid-column-end: span 6;
    }
    .column--tablet-7 {
      grid-column-end: span 7;
    }
    .column--tablet-8 {
      grid-column-end: span 8;
    }
    .column--tablet-9 {
      grid-column-end: span 9;
    }
    .column--tablet-10 {
      grid-column-end: span 10;
    }
    .column--tablet-11 {
      grid-column-end: span 11;
    }
    .column--tablet-12 {
      grid-column-end: span 12;
    }
  }

  /* Desktop (1024px and above) */
  @media (min-width: 1024px) {
    .column--desktop-1 {
      grid-column-end: span 1;
    }
    .column--desktop-2 {
      grid-column-end: span 2;
    }
    .column--desktop-3 {
      grid-column-end: span 3;
    }
    .column--desktop-4 {
      grid-column-end: span 4;
    }
    .column--desktop-5 {
      grid-column-end: span 5;
    }
    .column--desktop-6 {
      grid-column-end: span 6;
    }
    .column--desktop-7 {
      grid-column-end: span 7;
    }
    .column--desktop-8 {
      grid-column-end: span 8;
    }
    .column--desktop-9 {
      grid-column-end: span 9;
    }
    .column--desktop-10 {
      grid-column-end: span 10;
    }
    .column--desktop-11 {
      grid-column-end: span 11;
    }
    .column--desktop-12 {
      grid-column-end: span 12;
    }

    .column--desktop-offset-1 {
      grid-column-start: 2;
    }
    .column--desktop-offset-2 {
      grid-column-start: 3;
    }
    .column--desktop-offset-3 {
      grid-column-start: 4;
    }
    .column--desktop-offset-4 {
      grid-column-start: 5;
    }
    .column--desktop-offset-5 {
      grid-column-start: 6;
    }
    .column--desktop-offset-6 {
      grid-column-start: 7;
    }
    .column--desktop-offset-7 {
      grid-column-start: 8;
    }
    .column--desktop-offset-8 {
      grid-column-start: 9;
    }
    .column--desktop-offset-9 {
      grid-column-start: 10;
    }
    .column--desktop-offset-10 {
      grid-column-start: 11;
    }
    .column--desktop-offset-11 {
      grid-column-start: 12;
    }
  }

  /* Utility classes */
  .grid-fill-height {
    height: 100%;
  }

  .grid-center-content {
    align-items: center;
    justify-items: center;
  }
`;
