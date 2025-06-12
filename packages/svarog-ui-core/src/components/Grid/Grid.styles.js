// src/components/Grid/Grid.styles.js
import { css } from '../../utils/styleInjection.js';

export const gridStyles = css`
  /**
   * Grid component styles using CSS Custom Properties
   * No !important needed - clean cascade management
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

  /* Column Styles with CSS Custom Properties */
  .column {
    box-sizing: border-box;
    direction: ltr; /* Ensure content is always ltr even in rtl grids */

    /* Default column span using CSS variable */
    grid-column-end: span var(--col-width, 12);
  }

  /* Responsive column behavior using CSS variables */
  /* Mobile (under 768px) */
  @media (max-width: 767px) {
    .column {
      /* Use mobile width if set, otherwise fall back to default width */
      grid-column-end: span var(--col-width-mobile, var(--col-width, 12));
    }
  }

  /* Tablet (768px - 1023px) */
  @media (min-width: 768px) and (max-width: 1023px) {
    .column {
      /* Use tablet width if set, otherwise fall back to default width */
      grid-column-end: span var(--col-width-tablet, var(--col-width, 12));
    }
  }

  /* Desktop (1024px and above) */
  @media (min-width: 1024px) {
    .column {
      /* Use desktop width if set, otherwise fall back to default width */
      grid-column-end: span var(--col-width-desktop, var(--col-width, 12));

      /* Desktop offset if set */
      grid-column-start: var(--col-offset-desktop, auto);
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

  /* Container query support for future-proofing */
  @supports (container-type: inline-size) {
    .grid {
      container-type: inline-size;
    }

    /* Container-based responsive design (when supported) */
    @container (max-width: 767px) {
      .column {
        grid-column-end: span var(--col-width-mobile, var(--col-width, 12));
      }
    }

    @container (min-width: 768px) and (max-width: 1023px) {
      .column {
        grid-column-end: span var(--col-width-tablet, var(--col-width, 12));
      }
    }

    @container (min-width: 1024px) {
      .column {
        grid-column-end: span var(--col-width-desktop, var(--col-width, 12));
      }
    }
  }
`;
