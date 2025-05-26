import { css } from '../../utils/styleInjection.js';

export const navigationStyles = css`
  /**
   * Navigation component styles
   */

  .nav {
    position: relative;
    font-size: var(--nav-font-size);
    line-height: var(--nav-line-height);
    display: flex;
    flex-direction: column;
  }

  /* Horizontal layout */
  .nav--horizontal {
    flex-direction: row;
    align-items: center;
  }

  /* Navigation List */
  .nav__list {
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: var(--nav-item-spacing);
  }

  .nav--vertical .nav__list {
    flex-direction: column;
    align-items: stretch;
    gap: var(--nav-item-spacing-vertical);
  }

  /* Navigation Items */
  .nav__item {
    position: relative;
    padding: 0;
  }

  .nav--vertical .nav__item {
    width: 100%;
  }

  /* Navigation Links */
  .nav__link {
    display: flex; /* Change from inline-flex to flex */
    align-items: center;
    color: var(--nav-link-color);
    text-decoration: none;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    transition:
      color 0.3s ease,
      border-color 0.3s ease;
    white-space: nowrap;
    position: relative;
    width: 100%;
    text-align: left;
    padding: var(--space-2) 0;
    margin-bottom: 0;
    border-bottom: 2px solid transparent;
    box-sizing: border-box;
    height: 40px;
    line-height: 1.5;
  }

  .nav__link:hover {
    color: var(--nav-link-hover-color, var(--color-primary));
  }

  /* Active state with border-bottom */
  .nav__item--active > .nav__link {
    color: var(--nav-link-active-color, var(--color-primary));
    border-bottom: 2px solid var(--nav-link-active-color, var(--color-primary));
  }

  /* Disabled state */
  .nav__item--disabled > .nav__link {
    opacity: var(--disabled-opacity, 0.6);
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Submenus */
  .nav__submenu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Dropdown styling for horizontal nav */
  .nav:not(.nav--vertical):not(.nav--open) .nav__submenu {
    position: absolute;
    top: calc(100% + var(--space-4)); /* Add space without using margin */
    left: 0; /* Aligned with the start of parent item */
    z-index: var(--z-index-dropdown, 1000);
    min-width: 200px;
    background-color: var(--nav-dropdown-bg);
    display: none;
    padding: 0; /* Add some padding to the submenu */
  }

  /* Submenu shadow option - only applied when the prop is true */
  .nav--submenu-shadow:not(.nav--vertical):not(.nav--open) .nav__submenu {
    box-shadow: var(--nav-dropdown-shadow);
  }

  .nav:not(.nav--vertical):not(.nav--open)
    .nav__item--expanded
    > .nav__submenu {
    display: block;
  }

  .nav:not(.nav--vertical):not(.nav--open) .nav__submenu .nav__link {
    width: 100%;
    padding: 0;
    font-size: var(
      --font-size-sm,
      0.875rem
    ); /* Smaller font size for submenu items */
  }

  /* Vertical navigation submenus - align with parent text */
  .nav--vertical .nav__submenu {
    padding-left: var(--nav-submenu-indent);
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;
  }

  .nav--vertical .nav__item--expanded > .nav__submenu {
    height: auto; /* Auto height to properly calculate */
  }

  .nav--vertical .nav__submenu .nav__link {
    padding-left: var(--nav-link-padding);
    font-size: var(--font-size-sm); /* Smaller font size for submenu items */
    border-bottom: none; /* No border for submenu items in vertical navigation */
  }

  /* Reset border for submenu items to avoid stacking borders */
  .nav__submenu .nav__link {
    border-bottom: none;
  }

  .nav__submenu .nav__item--active > .nav__link {
    border-bottom: none;
    background-color: rgba(
      0,
      0,
      0,
      0.03
    ); /* Subtle background for active submenu items */
  }

  /* Burger button */
  .nav__burger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: var(--nav-burger-size);
    height: calc(var(--nav-burger-size) - 6px);
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    position: relative;
    z-index: var(--z-index-sticky);
  }

  .nav__burger-line {
    width: 100%;
    height: 2px;
    background-color: var(--nav-burger-color, var(--color-text));
    transition: all 0.3s ease;
    transform-origin: center;
  }

  /* Burger positioning */
  .nav--burger-left .nav__burger {
    margin-right: auto;
    order: -1;
  }

  .nav--burger-right .nav__burger {
    margin-left: auto;
    order: 1;
  }

  /* Mobile Navigation */
  @media (max-width: 768px) {
    .nav--responsive {
      flex-wrap: wrap;
    }

    .nav--responsive .nav__burger {
      display: flex;
    }

    .nav--responsive .nav__list {
      display: none;
      flex-direction: column;
      align-items: flex-start; /* Align items to the left */
      background-color: var(--nav-mobile-bg);
      padding: var(--nav-mobile-padding);
      width: 100%;
      order: 3; /* Make sure it appears below any logo */
      flex-basis: 100%; /* Take full width */
      gap: var(--nav-item-spacing-vertical);
    }

    .nav--responsive.nav--open .nav__list {
      display: flex;
    }

    .nav--responsive .nav__item {
      margin-right: 0;
      width: 100%;
    }

    .nav--responsive .nav__item:last-child {
      margin-bottom: 0;
    }

    .nav--responsive .nav__link {
      width: 100%;
      padding: var(--nav-mobile-link-padding);
      font-size: var(--font-size-base);
      border-bottom: none; /* Remove bottom border in mobile view */
    }

    .nav--responsive .nav__link:hover {
      background-color: var(--nav-mobile-hover-bg);
    }

    /* Replace underline with background in mobile */
    .nav--responsive .nav__item--active > .nav__link {
      background-color: var(--nav-mobile-active-bg);
      border-bottom: none; /* Remove border in mobile and use background instead */
    }

    /* Mobile submenus */
    .nav--responsive .nav__submenu {
      height: 0;
      overflow: hidden;
      transition: height 0.3s ease;
      background-color: var(--nav-mobile-submenu-bg);
      width: 100%;
      will-change: height; /* Optimizes animation */
    }

    .nav--responsive .nav__item--expanded > .nav__submenu {
      height: auto; /* Auto height to properly calculate */
    }

    .nav--responsive .nav__submenu .nav__item {
      margin-bottom: 0;
    }

    /* Align submenu with parent in mobile */
    .nav--responsive .nav__submenu .nav__link {
      font-size: var(--font-size-sm); /* Smaller font size */
      padding: 0; /* Match the parent padding */
    }

    /* Improved burger animation to X when open */
    .nav--responsive.nav--open .nav__burger-line:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    .nav--responsive.nav--open .nav__burger-line:nth-child(2) {
      opacity: 0;
    }

    .nav--responsive.nav--open .nav__burger-line:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }
`;
