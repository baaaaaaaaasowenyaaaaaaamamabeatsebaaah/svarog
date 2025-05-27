
// Auto-generated entry point for svarog-ui-core build
import { injectStyles, css } from '../../../src/utils/styleInjection.js';

// Base styles from src/styles/base/
const baseStyles = css`
/* 00-reset.css */
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}


/* 01-colors.css */
/* src/styles/base/01-colors.css */
:root {
  /* Grayscale */
  --color-black: #000000;
  --color-gray-900: #1a202c;
  --color-gray-800: #2d3748;
  --color-gray-700: #4a5568;
  --color-gray-600: #718096;
  --color-gray-500: #a0aec0;
  --color-gray-400: #cbd5e0;
  --color-gray-300: #e2e8f0;
  --color-gray-200: #edf2f7;
  --color-gray-100: #f7fafc;
  --color-white: #ffffff;

  /* Text colors */
  --color-text: var(--color-gray-900);
  --color-text-light: var(--color-gray-700);
  --color-text-lighter: var(--color-gray-500);
  --color-text-white: var(--color-white);
  --color-text-disabled: var(--color-gray-500);

  /* Background colors */
  --color-bg: var(--color-white);
  --color-bg-light: var(--color-gray-100);
  --color-bg-dark: var(--color-gray-900);

  /* Border colors */
  --color-border-light: var(--color-gray-300);
  --color-border-medium: var(--color-gray-400);
  --color-border-dark: var(--color-gray-500);

  /* Semantic colors */
  --color-primary: #3182ce;
  --color-secondary: #ed64a6;

  /* Success Colors (Greens) */
  --color-success: #4caf50;
  --color-success-dark: #3d8b40;
  --color-success-light: #80c883;

  /* Danger Colors (Reds) */
  --color-danger: #f44336;
  --color-danger-dark: #c3352b;
  --color-danger-light: #f88078;

  /* Warning Colors (Yellows/Oranges) */
  --color-warning: #ff9800;
  --color-warning-dark: #cc7a00;
  --color-warning-light: #ffbc66;

  /* Info Colors (Teals) */
  --color-info: #00bcd4;
  --color-info-dark: #0097a7;
  --color-info-light: #6be3f2;

  /* Neutral Colors (Grays) */
  --color-neutral: #757575;
  --color-neutral-dark: #5d5d5d;
  --color-neutral-light: #a4a4a4;

  /* Light/Dark Base Colors */
  --color-light: #f5f5f5;
  --color-dark: #212121;

  --color-transparent: transparent;
  --color-current: currentColor;
  --color-inherit: inherit;
  --color-initial: initial;
  --color-unset: unset;
  --color-revert: revert;
  --color-revert-layer: revert-layer;
  --color-clip: clip;
  --color-visibility: visible;
  --color-hidden: hidden;
  --color-scroll: scroll;
  --color-auto: auto;
  --color-ellipsis: ellipsis;
  --color-clip: clip;
  --color-clip-path: path;
}


/* 02-spacing.css */
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 28px;
  --space-8: 32px;
  --space-9: 36px;
  --space-10: 40px;
  --space-11: 44px;
  --space-12: 48px;
  --space-13: 52px;
  --space-14: 56px;
  --space-15: 60px;
  --space-16: 64px;
  --space-17: 68px;
  --space-18: 72px;
  --space-19: 76px;
  --space-20: 80px;
}


/* 03-typography.css */
/* src/styles/base/03-typography.css */
:root {
  /* Font Families */
  --font-family-primary:
    'balto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
  --font-family-secondary: serif;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 32px;
  --font-size-5xl: 36px;
  --font-size-6xl: 48px;
  --font-size-7xl: 60px;
  --font-size-8xl: 72px;
  --font-size-9xl: 96px;

  /* Line Heights */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Letter Spacing */
  --letter-spacing-tight: -0.01em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}


/* 04-layout.css */
/* src/styles/base/04-layout.css */
:root {
  /* Containers */
  --container-max-width: 1440px;
  --container-padding: var(--space-4);

  /* Grid */
  --grid-columns: 12;
  --grid-gap: var(--space-4);

  /* Z-index layers */
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.05);

  /* Border radius */
  --border-radius-none: 0;
  --border-radius-sm: 2px;
  --border-radius-md: 4px;
  --border-radius-lg: 6px;
  --border-radius-xl: 8px;
  --border-radius-full: 9999px;

  /* Media query breakpoints */
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}


/* 05-states.css */
/**
 * Base interactive state variables
 */

:root {
  /* Transitions */
  --transition-fast: all 0.1s ease;
  --transition-normal: all 0.2s ease;
  --transition-slow: all 0.3s ease;

  /* Focus state */
  --focus-ring-width: 2px;
  --focus-ring-color: rgba(25, 118, 210, 0.25);
  --focus-ring-offset: 2px;
  --focus-ring: 0 0 0 var(--focus-ring-width) var(--focus-ring-color);

  /* Disabled state */
  --disabled-opacity: 0.6;
  --disabled-background: var(--color-gray-200);
  --disabled-color: var(--color-gray-600);

  /* Hover state */
  --hover-brightness: 0.9;
  --hover-overlay: rgba(0, 0, 0, 0.05);

  /* Active state */
  --active-brightness: 0.8;
  --active-overlay: rgba(0, 0, 0, 0.1);
}

`;

// Inject base styles on first import (with high priority so themes can override)
if (typeof document !== 'undefined') {
  injectStyles('svarog-base-styles', baseStyles, { priority: 'high' });
}

// Export all components and utilities
export * from '../../../packages/svarog-ui-core/src/index.js';
