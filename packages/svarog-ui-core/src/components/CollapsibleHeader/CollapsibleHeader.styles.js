// src/components/CollapsibleHeader/CollapsibleHeader.styles.js
import { css } from '../../utils/styleInjection.js';

export const collapsibleHeaderStyles = css`
  /* ====================
     1. Base Variables
     ==================== */
  .collapsible-header {
    --collapsible-header-height: 160px;
    --collapsible-header-collapsed-height: 120px;
    --collapsible-header-mobile-height: 80px;
    --collapsible-header-transition: transform 0.3s ease, height 0.3s ease;
    --collapsible-header-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    --collapsible-header-logo-transition: transform 0.3s ease;
    --collapsible-header-contact-bg: var(--color-bg);
    --collapsible-header-contact-transition:
      height 0.3s ease, opacity 0.3s ease;
  }

  /* ====================
       2. Base Layout
       ==================== */
  .collapsible-header {
    position: sticky;
    top: 0;
    z-index: var(--z-index-sticky);
    transition: var(--collapsible-header-transition);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg);
    box-shadow: var(--collapsible-header-shadow);
    height: var(--collapsible-header-height);
    width: 100%;
  }

  /* Main container */
  .collapsible-header__container {
    width: 100%;
    height: 100%;
    max-width: var(--container-max-width);
    margin: 0 64px;
    position: relative;
    display: flex;
  }

  /* ====================
       3. Logo Styles - CSS Variable Approach
       ==================== */
  .collapsible-header__logo {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: var(--space-6);
    transition: var(--collapsible-header-logo-transition);
  }

  /* Full logo size (desktop, expanded) */
  .collapsible-header .header-logo--full {
    --logo-width: 120px;
    --logo-height: auto;
  }

  /* Compact logo size (collapsed or mobile) */
  .collapsible-header .header-logo--compact {
    --logo-width: 120px;
    --logo-height: auto;
  }

  /* Apply logo container sizing */
  .collapsible-header .logo-container {
    width: var(--logo-width, 120px);
    height: var(--logo-height, auto);
    transition: all 0.3s ease;
  }

  /* ====================
       4. Content Area
       ==================== */
  .collapsible-header__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    flex: 1;
    transition: all 0.3s ease;
  }

  /* Contact info container with animation */
  .collapsible-header__contact-container {
    display: flex;
    justify-content: flex-end; /* Right-aligned */
    padding: var(--space-2) 0;
    background-color: var(--collapsible-header-contact-bg);
    transition: var(--collapsible-header-contact-transition);
    overflow: hidden;
    height: auto;
  }

  /* Navigation container */
  .collapsible-header__navigation {
    display: flex;
    align-items: center;
    justify-content: flex-end; /* Right-aligned */
    padding: var(--space-2) 0;
    transition: all 0.3s ease;
    margin-bottom: var(--space-2);
  }

  /* ====================
       5. Call Button
       ==================== */
  .collapsible-header__call-button {
    margin-left: var(--space-4);
  }

  /* Make call button match brand colors */
  .collapsible-header__call-button .btn--primary {
    background-color: var(--color-brand-primary, #4294d0);
    color: white;
    border-color: var(--color-brand-primary, #4294d0);
  }

  /* ====================
       6. Collapsed State
       ==================== */
  .collapsible-header--collapsed {
    height: var(--collapsible-header-collapsed-height);
  }

  /* Hide contact info in collapsed state */
  .collapsible-header--collapsed .collapsible-header__contact-container {
    height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  /* Ensure navigation is vertically centered in collapsed state */
  .collapsible-header--collapsed .collapsible-header__content {
    justify-content: center;
  }

  .collapsible-header--collapsed .collapsible-header__navigation {
    padding-bottom: 0;
    align-items: center;
  }

  /* Scale down logo container slightly in collapsed state */
  .collapsible-header--collapsed .collapsible-header__logo {
    transform: scale(0.95);
  }

  /* ====================
       7. Navigation Adjustments
       ==================== */
  /* Remove margin from last nav item to align with contact info */
  .collapsible-header .nav__item:last-child .nav__link {
    padding-right: 0;
  }

  /* Contact info styles */
  .collapsible-header .contact-info {
    font-size: var(--font-size-sm, 14px);
    margin-top: var(--space-2);
  }

  /* ====================
     8. Sticky Contact Icons
     ==================== */
  .collapsible-header__sticky-icons {
    position: fixed;
    z-index: 99;
    /* Display is controlled by JavaScript */
  }

  /* Desktop positioning */
  @media (min-width: 769px) {
    .collapsible-header__sticky-icons {
      top: 160px; /* Just below collapsed header */
      right: 0;
      flex-direction: column;
    }
  }

  /* Mobile positioning */
  @media (max-width: 768px) {
    .collapsible-header__sticky-icons {
      bottom: var(--space-4);
      right: var(--space-2);
      top: auto;
      flex-direction: row;
    }
  }

  /* ====================
       9. Mobile Styles
       ==================== */
  @media (max-width: 768px) {
    /* Mobile header styles */
    .collapsible-header,
    .collapsible-header--mobile {
      height: var(--collapsible-header-mobile-height);
    }

    .collapsible-header__container {
      margin: 0 16px; /* Smaller margin on mobile */
      display: flex;
      flex-direction: row;
      position: relative;
    }

    /* Fixed position for logo on mobile */
    .collapsible-header__logo {
      margin-right: 0;
      z-index: 3;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    /* Fixed position for burger menu on mobile */
    .collapsible-header .nav__burger {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 3;
    }

    /* Set logos to smaller size on mobile using CSS variables */
    .collapsible-header .header-logo--full,
    .collapsible-header .header-logo--compact {
      --logo-width: 100px;
      --logo-height: auto;
    }

    /* Override any transform scaling on mobile */
    .collapsible-header__logo {
      transform: translateY(-50%) !important;
    }

    /* Hide contact info on mobile */
    .collapsible-header__contact-container {
      display: none;
    }

    /* Content area takes remaining space */
    .collapsible-header__content {
      flex: 1;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      padding-right: var(--space-2);
    }

    /* Navigation container with burger menu */
    .collapsible-header__navigation {
      padding: 0;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }

    /* Hide call button on mobile */
    .collapsible-header__call-button {
      display: none;
    }

    /* Make sure burger menu appears on the right */
    .collapsible-header .nav--burger-right .nav__burger {
      margin-left: 0;
      order: 1;
    }

    /* ====================
         10. Mobile Menu Animation
         ==================== */
    /* Hamburger lines animation */
    .collapsible-header .nav--open .nav__burger-line:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    .collapsible-header .nav--open .nav__burger-line:nth-child(2) {
      opacity: 0;
    }

    .collapsible-header .nav--open .nav__burger-line:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }

    /* Full-width menu when open */
    .collapsible-header .nav--responsive.nav--open .nav__list {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100vh;
      background-color: white;
      display: flex;
      flex-direction: column;
      padding-top: calc(var(--collapsible-header-mobile-height) + 20px);
      z-index: 2;
      overflow-y: auto;
    }

    /* Style nav items in mobile menu */
    .collapsible-header .nav--open .nav__item {
      width: 100%;
      padding: 0;
      margin: 0;
      border-bottom: 1px solid #eee;
    }

    .collapsible-header .nav--open .nav__link {
      width: 100%;
      padding: 16px;
      display: block;
      font-size: var(--font-size-lg, 18px);
    }

    /* Highlight active/hover items */
    .collapsible-header .nav--open .nav__item--active .nav__link {
      background-color: #f5f5f5;
    }

    .collapsible-header .nav--open .nav__link:hover {
      background-color: #f9f9f9;
    }
  }

  /* ====================
       11. Small Mobile Screens
       ==================== */
  @media (max-width: 480px) {
    .collapsible-header__container {
      margin: 0 12px; /* Even smaller margin on very small screens */
    }

    /* Even smaller logos on very small screens */
    .collapsible-header .header-logo--full,
    .collapsible-header .header-logo--compact {
      --logo-width: 90px;
      --logo-height: auto;
    }
  }
`;
