// packages/svarog-ui-core/src/styles/baseVariables.js
import { injectStyles, css } from '../utils/styleInjection.js';

export const baseVariables = css`
  :root {
    /* Core spacing scale */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;
    --space-16: 64px;
    --space-20: 80px;
    --space-24: 96px;
    --space-32: 128px;
    --space-40: 160px;
    --space-48: 192px;
    --space-56: 224px;
    --space-64: 256px;

    /* Core colors */
    --color-white: #ffffff;
    --color-black: #000000;
    --color-transparent: transparent;

    /* Gray scale */
    --color-gray-50: #f9fafb;
    --color-gray-100: #f3f4f6;
    --color-gray-200: #e5e7eb;
    --color-gray-300: #d1d5db;
    --color-gray-400: #9ca3af;
    --color-gray-500: #6b7280;
    --color-gray-600: #4b5563;
    --color-gray-700: #374151;
    --color-gray-800: #1f2937;
    --color-gray-900: #111827;

    /* Semantic colors */
    --color-text: #1a202c;
    --color-text-light: #4a5568;
    --color-text-lighter: #718096;
    --color-text-disabled: #a0aec0;
    --color-text-white: #ffffff;
    --color-bg: #ffffff;
    --color-bg-secondary: #f7fafc;
    --color-bg-transparent: transparent;
    --color-border: #e2e8f0;
    --color-border-light: #edf2f7;
    --color-border-medium: #cbd5e0;
    --color-border-dark: #a0aec0;

    /* Status colors */
    --color-success: #48bb78;
    --color-success-light: #68d391;
    --color-success-dark: #38a169;
    --color-danger: #f56565;
    --color-danger-light: #fc8181;
    --color-danger-dark: #e53e3e;
    --color-warning: #ed8936;
    --color-warning-light: #f6ad55;
    --color-warning-dark: #dd6b20;
    --color-info: #4299e1;
    --color-info-light: #63b3ed;
    --color-info-dark: #3182ce;

    /* Typography scale */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 30px;
    --font-size-4xl: 36px;
    --font-size-5xl: 48px;
    --font-size-6xl: 60px;

    /* Font weights */
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;

    /* Line heights */
    --line-height-none: 1;
    --line-height-tight: 1.25;
    --line-height-snug: 1.375;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;
    --line-height-loose: 2;

    /* Transitions */
    --transition-fast: all 0.15s ease;
    --transition-normal: all 0.3s ease;
    --transition-slow: all 0.5s ease;
    --transition-duration: 0.3s;
    --transition-timing: ease;

    /* Shadows */
    --shadow-none: none;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md:
      0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg:
      0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl:
      0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    /* Border radius */
    --radius-none: 0;
    --radius-sm: 2px;
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-xl: 12px;
    --radius-2xl: 16px;
    --radius-3xl: 24px;
    --radius-full: 9999px;

    /* Z-index scale */
    --z-index-0: 0;
    --z-index-10: 10;
    --z-index-20: 20;
    --z-index-30: 30;
    --z-index-40: 40;
    --z-index-50: 50;
    --z-index-dropdown: 1000;
    --z-index-sticky: 1020;
    --z-index-fixed: 1030;
    --z-index-modal-backdrop: 1040;
    --z-index-modal: 1050;
    --z-index-popover: 1060;
    --z-index-tooltip: 1070;

    /* Other common variables */
    --disabled-background: #f7fafc;
    --disabled-opacity: 0.6;
    --hover-opacity: 0.8;
    --focus-ring: 0 0 0 3px rgba(66, 153, 225, 0.5);
    --container-max-width: 1200px;
    --container-padding: 16px;
    --container-padding-mobile: 16px;
  }
`;

// Auto-inject base variables when module is imported
// This ensures variables are available before any component styles
if (typeof document !== 'undefined') {
  injectStyles('svarog-base-variables', baseVariables, {
    priority: 'base',
    media: 'all',
  });
}
